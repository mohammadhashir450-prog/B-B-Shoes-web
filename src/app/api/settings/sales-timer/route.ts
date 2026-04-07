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

  const settings = await SiteSettings.findOne({ key: 'global' }).select('salesEndsAt salesTickerMessage salesTickerSpeed flatSalePercent updatedAt');

  return successResponse(
    {
      salesEndsAt: settings?.salesEndsAt || null,
      salesTickerMessage: settings?.salesTickerMessage || '',
      salesTickerSpeed: Number(settings?.salesTickerSpeed || 18),
      flatSalePercent: Number(settings?.flatSalePercent || 0),
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
  const inputTickerMessage = typeof body?.salesTickerMessage === 'string' ? body.salesTickerMessage : '';
  const inputTickerSpeed = Number(body?.salesTickerSpeed);
  const inputFlatSalePercent = Number(body?.flatSalePercent);

  let salesEndsAt: Date | null = null;

  if (inputValue !== null && inputValue !== undefined && String(inputValue).trim() !== '') {
    const parsed = new Date(String(inputValue));
    if (Number.isNaN(parsed.getTime())) {
      return validationErrorResponse(['salesEndsAt must be a valid datetime']);
    }
    salesEndsAt = parsed;
  }

  const salesTickerMessage = inputTickerMessage.trim().slice(0, 180);
  const salesTickerSpeed = Number.isFinite(inputTickerSpeed)
    ? Math.min(45, Math.max(6, inputTickerSpeed))
    : 18;
  const flatSalePercent = Number.isFinite(inputFlatSalePercent)
    ? Math.min(100, Math.max(0, Math.round(inputFlatSalePercent)))
    : 0;

  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'global' },
    {
      $set: {
        key: 'global',
        salesEndsAt,
        salesTickerMessage,
        salesTickerSpeed,
        flatSalePercent,
        updatedBy: 'admin-panel',
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  ).select('salesEndsAt salesTickerMessage salesTickerSpeed flatSalePercent updatedAt');

  return successResponse(
    {
      salesEndsAt: settings?.salesEndsAt || null,
      salesTickerMessage: settings?.salesTickerMessage || '',
      salesTickerSpeed: Number(settings?.salesTickerSpeed || 18),
      flatSalePercent: Number(settings?.flatSalePercent || 0),
      updatedAt: settings?.updatedAt || null,
    },
    'Sales timer updated successfully'
  );
});
