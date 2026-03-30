import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbService';
import { Product } from '@/models';

function formatProduct(product: any) {
  if (!product) return null;

  const obj = typeof product.toObject === 'function' ? product.toObject() : product;

  return {
    ...obj,
    id: product._id?.toString?.() || obj.id,
    sizeStock: obj.sizeStock || [],
  };
}

// GET - Fetch single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: formatProduct(product),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch product',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();

    const product = await Product.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: formatProduct(product),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update product',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete product',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
