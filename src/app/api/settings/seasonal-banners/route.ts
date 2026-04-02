import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbService';
import SeasonalBanner from '@/models/SeasonalBanner';
import { successResponse, errorResponse, createdResponse, validationErrorResponse } from '@/lib/apiResponse';

/**
 * GET /api/settings/seasonal-banners
 * Fetch active seasonal banners or all banners if admin flag is set
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('all') === 'true';

    let query: any = {};
    
    if (!isAdmin) {
      // For public: only active banners within date range
      const now = new Date();
      query = {
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      };
    }

    const banners = await SeasonalBanner.find(query)
      .sort({ displayOrder: 1, startDate: -1 })
      .lean();

    return successResponse(banners);
  } catch (err) {
    const dbError = err instanceof Error ? err.message : 'Database error';
    console.error('Error fetching seasonal banners:', dbError);
    return errorResponse(dbError || 'Failed to fetch seasonal banners', 500);
  }
}

/**
 * POST /api/settings/seasonal-banners
 * Create a new seasonal banner (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { season, title, bannerImage, startDate, endDate } = body;

    if (!season || !title || !bannerImage || !startDate || !endDate) {
      return validationErrorResponse(['Season, title, banner image, start date, and end date are required']);
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return validationErrorResponse(['End date must be after start date']);
    }

    await dbConnect();

    const newBanner = await SeasonalBanner.create({
      season,
      title,
      description: body.description || '',
      bannerImage,
      linkUrl: body.linkUrl || '/collections',
      discountPercent: body.discountPercent || 0,
      startDate: start,
      endDate: end,
      isActive: body.isActive !== false,
      displayOrder: body.displayOrder || 0,
    });

    return createdResponse(newBanner);
  } catch (err) {
    const dbError = err instanceof Error ? err.message : 'Database error';
    console.error('Error creating seasonal banner:', dbError);
    return errorResponse(dbError || 'Failed to create seasonal banner', 500);
  }
}
