import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/dbService';
import { Product, Review } from '@/models';
import { asyncHandler } from '@/lib/errorHandler';
import { createdResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/lib/apiResponse';
import { validateReview } from '@/lib/validation';

const summarizeRatings = (reviews: any[]) => {
  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }

  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;

  reviews.forEach((review) => {
    const rating = Math.max(1, Math.min(5, Number(review.rating) || 0));
    totalRating += rating;
    ratingBreakdown[rating as 1 | 2 | 3 | 4 | 5] += 1;
  });

  return {
    totalReviews,
    averageRating: Number((totalRating / totalReviews).toFixed(1)),
    ratingBreakdown,
  };
};

export const GET = asyncHandler(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();

  const product = await Product.findById(params.id).select('_id');
  if (!product) {
    return notFoundResponse('Product');
  }

  const reviews = await Review.find({ productId: params.id, isApproved: true })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const formattedReviews = reviews.map((review: any) => ({
    id: review._id.toString(),
    customerName: review.customerName,
    rating: review.rating,
    comment: review.comment,
    isVerified: Boolean(review.isVerified),
    createdAt: review.createdAt,
  }));

  const summary = summarizeRatings(formattedReviews);

  return successResponse(
    {
      reviews: formattedReviews,
      summary,
    },
    'Reviews fetched successfully'
  );
});

export const POST = asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();

  const product = await Product.findById(params.id).select('_id');
  if (!product) {
    return notFoundResponse('Product');
  }

  const body = await req.json();
  const payload = {
    customerName: String(body?.customerName || '').trim(),
    customerEmail: String(body?.customerEmail || '').trim().toLowerCase(),
    rating: Number(body?.rating),
    comment: String(body?.comment || '').trim(),
  };

  const validation = validateReview(payload);
  if (!validation.isValid) {
    return validationErrorResponse(validation.errors);
  }

  const review = await Review.create({
    productId: params.id,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    rating: payload.rating,
    comment: payload.comment,
    isVerified: false,
    isApproved: true,
  });

  const allApproved = await Review.find({ productId: params.id, isApproved: true })
    .select('rating')
    .lean();

  const summary = summarizeRatings(allApproved);

  await Product.findByIdAndUpdate(params.id, {
    rating: summary.averageRating,
    reviews: summary.totalReviews,
  });

  return createdResponse(
    {
      review: {
        id: review._id.toString(),
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment,
        isVerified: review.isVerified,
        createdAt: review.createdAt,
      },
      summary,
    },
    'Review submitted successfully'
  );
});
