import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const FALLBACK_CLOUD_NAME = 'dt2ikjlfc';
const LOGO_REMOTE_FALLBACK =
  'https://raw.githubusercontent.com/mohammadhashir450-prog/B-B-Shoes-web/main/public/logo.png';

const parseCloudNameFromSecureUrl = (secureUrl: string): string | null => {
  try {
    const parsed = new URL(secureUrl);
    const parts = parsed.pathname.split('/').filter(Boolean);
    // Expected path: /<cloud_name>/image/upload/...
    return parts[0] || null;
  } catch {
    return null;
  }
};

const parsePublicIdFromSecureUrl = (secureUrl: string): string | null => {
  try {
    const marker = '/image/upload/';
    const markerIndex = secureUrl.indexOf(marker);
    if (markerIndex === -1) return null;

    const afterUpload = secureUrl.slice(markerIndex + marker.length);
    const segments = afterUpload.split('/').filter(Boolean);
    if (segments.length === 0) return null;

    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments = versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments;
    if (publicIdSegments.length === 0) return null;

    const withExt = publicIdSegments.join('/');
    const lastDot = withExt.lastIndexOf('.');

    return lastDot === -1 ? withExt : withExt.slice(0, lastDot);
  } catch {
    return null;
  }
};

const toBase64Url = (value: string): string => {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const secureUrl = String(body?.secureUrl || '').trim();
    const inputPublicId = String(body?.publicId || '').trim();

    if (!secureUrl && !inputPublicId) {
      return NextResponse.json(
        { success: false, message: 'secureUrl or publicId is required' },
        { status: 400 }
      );
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ||
      parseCloudNameFromSecureUrl(secureUrl) ||
      FALLBACK_CLOUD_NAME;

    cloudinary.config({
      cloud_name: cloudName,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const publicId = inputPublicId || parsePublicIdFromSecureUrl(secureUrl);
    if (!publicId) {
      return NextResponse.json({
        success: true,
        data: {
          imageUrl: secureUrl,
          publicId: null,
          logoApplied: false,
          watermarkMode: 'none',
        },
        message: 'Image uploaded successfully (processing skipped: public_id not detected)',
      });
    }

    const requestOrigin = req.nextUrl.origin;
    const logoUrl = requestOrigin.includes('localhost')
      ? LOGO_REMOTE_FALLBACK
      : `${requestOrigin}/logo.png`;
    const encodedOverlay = `l_fetch:${toBase64Url(logoUrl)},g_north_east,x_24,y_24,w_180,c_fit/fl_layer_apply`;

    const transformedUrl = cloudinary.url(publicId, {
      secure: true,
      transformation: [
        // Keep product visible, try to neutralize plain dark background.
        'e_make_transparent:12',
        'c_pad,w_1200,h_1200,b_white',
        encodedOverlay,
        'f_auto,q_auto',
      ],
    });

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: transformedUrl,
        publicId,
        logoApplied: true,
        watermarkMode: 'logo',
      },
      message: 'Image processed with white background and B&B logo',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to process product image',
      },
      { status: 500 }
    );
  }
}
