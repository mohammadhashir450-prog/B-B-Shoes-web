import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteSettings } from '@/models';
import { asyncHandler } from '@/lib/errorHandler';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';

/**
 * GET /api/settings/sales-timer
 * Returns current sales countdown end time
 */
export const GET = asyncHandler(async () => {
  try {
    await connectDB();
  } catch (dbError: any) {
    return errorResponse(
      dbError?.message || 'Database connection failed while loading sales timer',
      503
    );
  }

  const settings = await SiteSettings.findOne({ key: 'global' }).select('salesEndsAt updatedAt');

  return successResponse(
    {
      salesEndsAt: settings?.salesEndsAt || null,
      updatedAt: settings?.updatedAt || null,
    },
    'Sales timer fetched successfully'
  );
});

/**
 * PATCH /api/settings/sales-timer
 * Update sales countdown end time from admin panel
 */
export const PATCH = asyncHandler(async (req: NextRequest) => {
  try {
    await connectDB();
  } catch (dbError: any) {
    return errorResponse(
      dbError?.message || 'Database connection failed while updating sales timer',
      503
    );
  }

  const body = await req.json();
  const inputValue = body?.salesEndsAt;

  let salesEndsAt: Date | null = null;

  if (inputValue !== null && inputValue !== undefined && String(inputValue).trim() !== '') {
    const parsed = new Date(String(inputValue));
    if (Number.isNaN(parsed.getTime())) {
      return validationErrorResponse(['salesEndsAt must be a valid datetime']);
    }
    salesEndsAt = parsed;
  }

  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'global' },
    {
      $set: {
        key: 'global',
        salesEndsAt,
        updatedBy: 'admin-panel',
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  ).select('salesEndsAt updatedAt');

  return successResponse(
    {
      salesEndsAt: settings?.salesEndsAt || null,
      updatedAt: settings?.updatedAt || null,
    },
    'Sales timer updated successfully'
  );
});
