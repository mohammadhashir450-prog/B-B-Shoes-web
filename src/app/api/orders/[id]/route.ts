import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models';

// GET - Fetch single order
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch order',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update order',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
