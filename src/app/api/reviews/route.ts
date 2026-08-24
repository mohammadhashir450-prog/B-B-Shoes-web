import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbService';
import { Review, Product } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') || '20'), 50);

    // Fetch latest approved reviews
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (!reviews.length) {
      return NextResponse.json({ success: true, data: { reviews: [] } });
    }

    // Collect unique product IDs
    const productIds = Array.from(new Set(reviews.map((r: any) => r.productId)));

    // Fetch matching products
    const products = await Product.find({ _id: { $in: productIds } })
      .select('_id name image category brand price')
      .lean();

    const productMap: Record<string, any> = {};
    products.forEach((p: any) => {
      productMap[p._id.toString()] = p;
    });

    const formatted = reviews.map((r: any) => {
      const product = productMap[r.productId?.toString()] || null;
      return {
        id: r._id.toString(),
        customerName: r.customerName,
        rating: r.rating,
        comment: r.comment,
        isVerified: Boolean(r.isVerified),
        createdAt: r.createdAt,
        product: product
          ? {
              id: product._id.toString(),
              name: product.name,
              image: product.image,
              category: product.category,
              brand: product.brand,
              price: product.price,
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, data: { reviews: formatted } });
  } catch (err: any) {
    console.error('[GET /api/reviews]', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
