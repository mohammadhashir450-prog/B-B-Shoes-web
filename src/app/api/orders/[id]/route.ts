import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { Order, Product } from '@/models';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const normalize = (value: unknown) => String(value || '').trim().toLowerCase();

const extractProductId = (value: unknown) => {
  const raw = String(value || '').trim();
  return mongoose.Types.ObjectId.isValid(raw) ? raw : '';
};

const restoreStock = async (order: any) => {
  const items: any[] = Array.isArray(order.items) ? order.items : [];
  if (!items.length) return;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const item of items) {
        const productId = extractProductId(String(item.productId || ''));
        if (!productId) continue;

        const product = await Product.findById(productId).session(session);
        if (!product) continue;

        const qty = Math.max(1, Number(item.quantity) || 1);
        const reqSize = normalize(item.size);
        const reqColor = normalize(item.color);
        const sizeStock: any[] = Array.isArray((product as any).sizeStock)
          ? (product as any).sizeStock
          : [];

        if (sizeStock.length > 0) {
          let candidate =
            sizeStock.find(
              (e: any) => normalize(e.size) === reqSize && normalize(e.color) === reqColor
            ) ||
            sizeStock.find((e: any) => normalize(e.size) === reqSize) ||
            sizeStock.find((e: any) => normalize(e.color) === reqColor) ||
            sizeStock[0];

          if (candidate) {
            candidate.quantity = Math.max(0, Number(candidate.quantity || 0)) + qty;
          }

          const total = sizeStock.reduce(
            (s: number, e: any) => s + Math.max(0, Number(e.quantity || 0)),
            0
          );
          (product as any).sizeStock = sizeStock;
          product.stock = total;
          product.inStock = total > 0;
        } else {
          product.stock = Math.max(0, Number(product.stock || 0)) + qty;
          product.inStock = product.stock > 0;
        }

        product.sold = Math.max(0, Number(product.sold || 0) - qty);
        await product.save({ session, validateBeforeSave: false });
        console.log(`[Stock Restore][id] Product ${productId} restored ${qty} unit(s). New stock: ${product.stock}`);
      }
    });
  } catch (err) {
    console.error('[Stock Restore][id] Failed:', err);
  } finally {
    await session.endSession();
  }
};

// ─── GET — Fetch single order ─────────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    let order = null;
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      order = await Order.findById(params.id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: params.id });
    }

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order', error: error.message },
      { status: 500 }
    );
  }
}

// ─── PUT — Update order (admin) ───────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    // Fetch existing order BEFORE update to get current status
    const existingOrder = mongoose.Types.ObjectId.isValid(params.id)
      ? await Order.findById(params.id)
      : await Order.findOne({ orderId: params.id });

    if (!existingOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const currentStatus = String(existingOrder.status || 'pending').toLowerCase();
    const newStatus = String(body.status || '').toLowerCase();

    const order = await Order.findByIdAndUpdate(existingOrder._id, body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // ── Stock restore on cancellation ──────────────────────────────────────
    if (newStatus === 'cancelled' && currentStatus !== 'cancelled') {
      restoreStock(existingOrder).catch((err) =>
        console.error('[Stock Restore][PUT] Async error:', err)
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update order', error: error.message },
      { status: 500 }
    );
  }
}
