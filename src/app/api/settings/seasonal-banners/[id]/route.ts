import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbService';
import SeasonalBanner from '@/models/SeasonalBanner';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';
import { Types } from 'mongoose';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * PUT /api/settings/seasonal-banners/[id]
 * Update a seasonal banner
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return validationErrorResponse(['Invalid banner ID']);
    }

    const body = await request.json();
    await dbConnect();

    const banner = await SeasonalBanner.findById(id);
    if (!banner) {
      return errorResponse('Banner not found', 404);
    }

    // Validate dates if provided
    if (body.startDate && body.endDate) {
      const start = new Date(body.startDate);
      const end = new Date(body.endDate);
      if (start >= end) {
        return validationErrorResponse(['End date must be after start date']);
      }
    }

    // Update fields
    if (body.season) banner.season = body.season;
    if (body.title) banner.title = body.title;
    if (body.description !== undefined) banner.description = body.description;
    if (body.bannerImage) banner.bannerImage = body.bannerImage;
    if (body.linkUrl !== undefined) banner.linkUrl = body.linkUrl;
    if (body.discountPercent !== undefined) banner.discountPercent = Math.min(100, Math.max(0, body.discountPercent));
    if (body.startDate) banner.startDate = new Date(body.startDate);
    if (body.endDate) banner.endDate = new Date(body.endDate);
    if (body.isActive !== undefined) banner.isActive = body.isActive;
    if (body.displayOrder !== undefined) banner.displayOrder = body.displayOrder;

    await banner.save();

    return successResponse(banner, 'Seasonal banner updated successfully');
  } catch (err) {
    const dbError = err instanceof Error ? err.message : 'Database error';
    console.error('Error updating seasonal banner:', dbError);
    return errorResponse(dbError || 'Failed to update seasonal banner', 500);
  }
}

/**
 * DELETE /api/settings/seasonal-banners/[id]
 * Delete a seasonal banner
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return validationErrorResponse(['Invalid banner ID']);
    }

    await dbConnect();

    const banner = await SeasonalBanner.findByIdAndDelete(id);
    if (!banner) {
      return errorResponse('Banner not found', 404);
    }

    return successResponse(null, 'Seasonal banner deleted successfully');
  } catch (err) {
    const dbError = err instanceof Error ? err.message : 'Database error';
    console.error('Error deleting seasonal banner:', dbError);
    return errorResponse(dbError || 'Failed to delete seasonal banner', 500);
  }
}
