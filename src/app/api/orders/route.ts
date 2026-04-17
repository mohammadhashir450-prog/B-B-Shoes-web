import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import connectDB, { getMongoRuntimeInfo } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { asyncHandler } from '@/lib/errorHandler';
import { successResponse, createdResponse, validationErrorResponse, errorResponse } from '@/lib/apiResponse';
import { validateOrder } from '@/lib/validation';
import { buildAdminOrderMessage, buildAdminOrderWhatsAppUrl, ADMIN_WHATSAPP_DISPLAY } from '@/lib/whatsapp';
import { sendAdminWhatsAppMessage } from '@/lib/whatsappServer';

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
  paymentDetails: order.paymentDetails || null,
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
  const customerPhone = String(body.customerPhone || body.phone || '').trim();
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

  const requestPaymentDetails = body.paymentDetails || {};
  const normalizedPaymentDetails = {
    cod: requestPaymentDetails.cod
      ? {
          name: String(requestPaymentDetails.cod.name || '').trim(),
          phone: String(requestPaymentDetails.cod.phone || '').trim(),
          address: String(requestPaymentDetails.cod.address || '').trim(),
          city: String(requestPaymentDetails.cod.city || '').trim(),
        }
      : undefined,
    jazzcash: requestPaymentDetails.jazzcash
      ? {
          senderNumber: String(requestPaymentDetails.jazzcash.senderNumber || '').trim(),
          transactionId: String(requestPaymentDetails.jazzcash.transactionId || '').trim(),
          receiverNumber: String(requestPaymentDetails.jazzcash.receiverNumber || '').trim(),
          receiverName: String(requestPaymentDetails.jazzcash.receiverName || '').trim(),
        }
      : undefined,
    bank: requestPaymentDetails.bank
      ? {
          bankName: String(requestPaymentDetails.bank.bankName || '').trim(),
          receiverAccountNumber: String(requestPaymentDetails.bank.receiverAccountNumber || '').trim(),
          receiverTitle: String(requestPaymentDetails.bank.receiverTitle || '').trim(),
          senderAccountNumber: String(requestPaymentDetails.bank.senderAccountNumber || '').trim(),
          transactionId: String(requestPaymentDetails.bank.transactionId || '').trim(),
        }
      : undefined,
    card: requestPaymentDetails.card
      ? {
          cardHolderName: String(requestPaymentDetails.card.cardHolderName || '').trim(),
          cardBrand: String(requestPaymentDetails.card.cardBrand || '').trim(),
          cardLast4: String(
            requestPaymentDetails.card.cardLast4 ||
            String(requestPaymentDetails.card.cardNumber || '').replace(/\D/g, '').slice(-4)
          ).trim(),
          cardMasked: String(requestPaymentDetails.card.cardMasked || '').trim(),
          expiryMonth: String(requestPaymentDetails.card.expiryMonth || '').trim(),
          expiryYear: String(requestPaymentDetails.card.expiryYear || '').trim(),
          transactionId: String(requestPaymentDetails.card.transactionId || '').trim(),
        }
      : undefined,
  };

  const normalizedOrder = {
    user_id: resolvedUserId,
    customerName: body.customerName,
    customerEmail: email || body.customerEmail,
    customerPhone,
    customerAddress: body.customerAddress,
    items: normalizedItems,
    subtotal,
    shippingFee,
    total,
    status: body.status || 'pending',
    paymentMethod: body.paymentMethod || 'cod',
    paymentStatus: body.paymentStatus || 'pending',
    paymentDetails: normalizedPaymentDetails,
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
  const adminWhatsappUrl = buildAdminOrderWhatsAppUrl({
    orderId,
    customerName: normalizedOrder.customerName,
    customerPhone: normalizedOrder.customerPhone,
    customerEmail: normalizedOrder.customerEmail,
    customerAddress: normalizedOrder.customerAddress,
    paymentDetails: normalizedPaymentDetails,
    paymentMethod: normalizedOrder.paymentMethod,
    paymentStatus: normalizedOrder.paymentStatus,
    subtotal,
    shippingFee,
    total,
    items: normalizedItems,
  });

  const whatsappMessage = buildAdminOrderMessage({
    orderId,
    customerName: normalizedOrder.customerName,
    customerPhone: normalizedOrder.customerPhone,
    customerEmail: normalizedOrder.customerEmail,
    customerAddress: normalizedOrder.customerAddress,
    paymentDetails: normalizedPaymentDetails,
    paymentMethod: normalizedOrder.paymentMethod,
    paymentStatus: normalizedOrder.paymentStatus,
    subtotal,
    shippingFee,
    total,
    items: normalizedItems,
  });

  const whatsappDispatch = await sendAdminWhatsAppMessage(whatsappMessage);

  if (!whatsappDispatch.sent) {
    console.error('⚠️ WhatsApp auto-send failed:', whatsappDispatch.error || 'Unknown error');
  }

  console.log('✅ Order created:', orderId);

  return createdResponse(
    {
      ...formattedOrder,
      adminWhatsappUrl,
      adminWhatsappNumber: ADMIN_WHATSAPP_DISPLAY,
      adminWhatsappSent: whatsappDispatch.sent,
      adminWhatsappMessageId: whatsappDispatch.messageId || null,
      adminWhatsappError: whatsappDispatch.sent ? null : whatsappDispatch.error || 'Unknown error',
    },
    'Order created successfully'
  );
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
  const paymentStatus = String(body.paymentStatus || '').trim().toLowerCase();
  const orderId = String(body.orderId || '').trim();
  const id = String(body.id || '').trim();
  const requestUserId = String(body.user_id || '').trim();

  const allowedStatuses = new Set(['pending', 'processing', 'delivered', 'cancelled']);
  const allowedPaymentStatuses = new Set(['pending', 'paid', 'failed', 'refunded']);

  const wantsStatusUpdate = Boolean(status);
  const wantsPaymentUpdate = Boolean(paymentStatus);

  if (!wantsStatusUpdate && !wantsPaymentUpdate) {
    return validationErrorResponse(['status or paymentStatus is required']);
  }

  if (wantsStatusUpdate && !allowedStatuses.has(status)) {
    return validationErrorResponse(['Invalid status. Allowed: pending, processing, delivered, cancelled']);
  }

  if (wantsPaymentUpdate && !allowedPaymentStatuses.has(paymentStatus)) {
    return validationErrorResponse(['Invalid paymentStatus. Allowed: pending, paid, failed, refunded']);
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

  const existingOrder = await Order.collection.findOne(query);
  if (!existingOrder) {
    return errorResponse('Order not found', 404);
  }

  const currentStatus = String(existingOrder.status || 'pending').toLowerCase();

  if (wantsStatusUpdate && currentStatus === 'cancelled' && status !== 'cancelled') {
    return errorResponse('Cancelled orders cannot be updated', 409);
  }

  if (wantsStatusUpdate && status === 'cancelled') {
    if (!requestUserId) {
      return validationErrorResponse(['user_id is required to cancel order']);
    }

    if (String(existingOrder.user_id || '').trim() !== requestUserId) {
      return errorResponse('You are not allowed to cancel this order', 403);
    }

    const cancellableStatuses = new Set(['pending', 'confirmed']);
    if (!cancellableStatuses.has(currentStatus)) {
      return errorResponse('Order can only be cancelled before processing starts', 409);
    }
  }

  const updatePayload: Record<string, string> = {};

  if (wantsStatusUpdate) {
    updatePayload.status = status;
  }

  if (wantsPaymentUpdate) {
    updatePayload.paymentStatus = paymentStatus;

    if (!wantsStatusUpdate && paymentStatus === 'paid' && currentStatus === 'pending') {
      updatePayload.status = 'processing';
    }
  }

  const result = await Order.collection.findOneAndUpdate(
    query,
    { $set: updatePayload },
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
