import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import connectDB, { getMongoRuntimeInfo } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { asyncHandler } from '@/lib/errorHandler';
import { successResponse, createdResponse, validationErrorResponse, errorResponse } from '@/lib/apiResponse';
import { validateOrder } from '@/lib/validation';

const formatOrderForClient = (order: any) => ({
  id: order._id.toString(),
  orderId: order.orderId,
  user_id: order.user_id,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  customerAddress: order.customerAddress,
  items: (order.items || []).map((item: any) => ({
    id: item.productId,
    productId: item.productId,
    name: item.productName,
    productName: item.productName,
    image: item.productImage,
    productImage: item.productImage,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.price,
  })),
  subtotal: order.subtotal,
  shippingFee: order.shippingFee,
  total: order.total,
  status: order.status,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  date: order.createdAt,
});

/**
 * GET /api/orders
 * Fetch all orders with optional filtering
 */
export const GET = asyncHandler(async (req: NextRequest) => {
  try {
    await connectDB();
  } catch (dbError: any) {
    return errorResponse(
      dbError?.message || 'Database connection failed while fetching orders',
      503
    );
  }

  const getMeta = getMongoRuntimeInfo(Order.collection.collectionName);
  console.log(
    `[MongoMeta][Orders][GET] db=${getMeta.database} collection=${getMeta.collection} cluster=${getMeta.cluster} host=${getMeta.host}`
  );

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const email = searchParams.get('email');
  const userId = String(searchParams.get('user_id') || '').trim();
  const scope = searchParams.get('scope');

  // Build query
  const query: any = {};
  if (status) query.status = status;
  if (email) query.customerEmail = email;
  if (userId) {
    query.user_id = userId;
  } else if (scope !== 'all' && !status && !email) {
    return validationErrorResponse(['user_id is required to fetch customer orders']);
  }

  const orders = await Order.collection.find(query).sort({ createdAt: -1 }).toArray();

  const formattedOrders = orders.map(formatOrderForClient);

  console.log(`✅ Fetched ${formattedOrders.length} orders`);

  return successResponse(
    { count: formattedOrders.length, orders: formattedOrders },
    'Orders fetched successfully'
  );
});

/**
 * POST /api/orders
 * Create a new order
 */
export const POST = asyncHandler(async (req: NextRequest) => {
  try {
    await connectDB();
  } catch (dbError: any) {
    return errorResponse(
      dbError?.message || 'Database connection failed while creating order',
      503
    );
  }

  const postMeta = getMongoRuntimeInfo(Order.collection.collectionName);
  console.log(
    `[MongoMeta][Orders][POST] db=${postMeta.database} collection=${postMeta.collection} cluster=${postMeta.cluster} host=${postMeta.host}`
  );

  const body = await req.json();

  const email = String(body.customerEmail || '').toLowerCase().trim();
  const customerName = String(body.customerName || 'User').trim();
  let resolvedUserId = String(body.user_id || '').trim();

  // Ensure user exists and resolve user_id for order ownership.
  if (email) {
    let existingUser = await User.findOne({ email }).select('_id user_id name email');

    if (!existingUser) {
      existingUser = await User.create({
        name: customerName,
        email,
        provider: 'credentials',
        role: 'user',
        isAdmin: false,
        wishlist: [],
        cart: [],
      });
    }

    if (!existingUser.user_id) {
      existingUser.user_id = `USR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      await existingUser.save();
    }

    resolvedUserId = String(existingUser.user_id || '').trim();
  }

  if (!resolvedUserId) {
    return validationErrorResponse(['Unable to resolve user_id for this order']);
  }

  const normalizedItems = (body.items || []).map((item: any) => ({
    productId: String(item.productId || item.id || ''),
    productName: item.productName || item.name || 'Product',
    productImage: item.productImage || item.image || '',
    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
    size: String(item.size || 'N/A'),
    color: item.color || 'Default',
    price: Number(item.price) || 0,
  }));

  const subtotal = Number(body.subtotal) || normalizedItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shippingFee = Number(body.shippingFee) || 0;
  const total = Number(body.total) || Number(body.totalPrice) || subtotal + shippingFee;

  const normalizedOrder = {
    user_id: resolvedUserId,
    customerName: body.customerName,
    customerEmail: email || body.customerEmail,
    customerPhone: body.customerPhone,
    customerAddress: body.customerAddress,
    items: normalizedItems,
    subtotal,
    shippingFee,
    total,
    status: body.status || 'pending',
    paymentMethod: body.paymentMethod || 'cod',
    paymentStatus: body.paymentStatus || 'pending',
    notes: body.notes,
  };

  if (!normalizedOrder.items.length) {
    return validationErrorResponse(['Order must contain at least one valid item']);
  }

  // Validate order data
  const validation = validateOrder(normalizedOrder);
  if (!validation.isValid) {
    return validationErrorResponse(validation.errors);
  }

  // Generate unique order ID
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Create order
  const order = await Order.create({
    ...normalizedOrder,
    orderId,
  });

  console.log('✅ Order persisted to DB with _id:', order._id?.toString());

  const formattedOrder = formatOrderForClient(order);

  console.log('✅ Order created:', orderId);

  return createdResponse(formattedOrder, 'Order created successfully');
});

/**
 * PATCH /api/orders
 * Update order status (admin)
 */
export const PATCH = asyncHandler(async (req: NextRequest) => {
  try {
    await connectDB();
  } catch (dbError: any) {
    return errorResponse(
      dbError?.message || 'Database connection failed while updating order status',
      503
    );
  }

  const body = await req.json();
  const status = String(body.status || '').trim().toLowerCase();
  const orderId = String(body.orderId || '').trim();
  const id = String(body.id || '').trim();

  const allowedStatuses = new Set(['pending', 'processing', 'delivered']);
  if (!allowedStatuses.has(status)) {
    return validationErrorResponse(['Invalid status. Allowed: pending, processing, delivered']);
  }

  if (!orderId && !id) {
    return validationErrorResponse(['orderId or id is required']);
  }

  if (!orderId && id && !mongoose.Types.ObjectId.isValid(id)) {
    return validationErrorResponse(['Invalid order id']);
  }

  const query: any = orderId
    ? { orderId }
    : { _id: new mongoose.Types.ObjectId(id) };

  const result = await Order.collection.findOneAndUpdate(
    query,
    { $set: { status } },
    { returnDocument: 'after' }
  );

  if (!result) {
    return errorResponse('Order not found', 404);
  }

  return successResponse(
    { order: formatOrderForClient(result) },
    'Order status updated successfully'
  );
});
