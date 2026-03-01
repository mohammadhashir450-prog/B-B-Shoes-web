import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models';
import { asyncHandler } from '@/lib/errorHandler';
import { successResponse, createdResponse, validationErrorResponse } from '@/lib/apiResponse';
import { validateOrder } from '@/lib/validation';

/**
 * GET /api/orders
 * Fetch all orders with optional filtering
 */
export const GET = asyncHandler(async (req: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const email = searchParams.get('email');

  // Build query
  const query: any = {};
  if (status) query.status = status;
  if (email) query.customerEmail = email;

  const orders = await Order.find(query).sort({ createdAt: -1 });

  // Convert _id to id for frontend compatibility
  const formattedOrders = orders.map(order => ({
    id: order._id.toString(),
    orderId: order.orderId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    items: order.items,
    total: order.total,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    date: order.createdAt,
  }));

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
  await connectDB();

  const body = await req.json();

  // Validate order data
  const validation = validateOrder(body);
  if (!validation.isValid) {
    return validationErrorResponse(validation.errors);
  }

  // Generate unique order ID
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Create order
  const order = await Order.create({
    ...body,
    orderId,
  });

  // Format response
  const formattedOrder = {
    id: order._id.toString(),
    ...order.toObject(),
  };

  console.log('✅ Order created:', orderId);

  return createdResponse(formattedOrder, 'Order created successfully');
});
