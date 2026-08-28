import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import ShippingConfig from '@/models/ShippingConfig';

export const dynamic = 'force-dynamic';

// ─── Default config (returned if DB has none yet) ────────────────────────────
const DEFAULT_CONFIG = {
  fee: 0,
  isFree: true,
  freeThreshold: 0,
  label: 'Free',
};

// ─── GET — public, returns active shipping config ────────────────────────────
export async function GET() {
  try {
    await connectDB();
    const config = await ShippingConfig.findOne().sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: config || DEFAULT_CONFIG });
  } catch {
    // Always return something usable — fall back to free
    return NextResponse.json({ success: true, data: DEFAULT_CONFIG });
  }
}

// ─── PUT — admin only, upsert shipping config ────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    // ── Auth guard: only admin can change shipping ──────────────────────────
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized — please login' },
        { status: 401 }
      );
    }
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden — admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await req.json();

    const fee = Math.max(0, Number(body.fee) || 0);
    const freeThreshold = Math.max(0, Number(body.freeThreshold) || 0);
    // isFree = true when fee is 0 OR admin explicitly sets it
    const isFree = body.isFree === true || fee === 0;
    const label = isFree ? 'Free' : `PKR ${fee.toLocaleString()}`;

    const config = await ShippingConfig.findOneAndUpdate(
      {},
      { fee, isFree, freeThreshold, label },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Shipping settings saved successfully',
      data: config,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to save shipping settings' },
      { status: 500 }
    );
  }
}

