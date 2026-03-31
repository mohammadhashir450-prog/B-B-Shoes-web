import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { access } from 'node:fs/promises';
import path from 'node:path';

const BRAND_LOGO_PUBLIC_ID = 'bb_brand_logo_main';
const FALLBACK_CLOUD_NAME = 'dt2ikjlfc';
const LOGO_FETCH_FALLBACK_URL = 'https://raw.githubusercontent.com/mohammadhashir450-prog/B-B-Shoes-web/main/public/logo.png';

const parseCloudNameFromSecureUrl = (secureUrl: string): string | null => {
  try {
    const parsed = new URL(secureUrl);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 1) return null;

    // URL format: /<cloud_name>/image/upload/...
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

    // Cloudinary delivery URL often contains transformations before version.
    // Keep everything after version segment (v123...) as public_id path.
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments = versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments;
    if (publicIdSegments.length === 0) return null;

    const withExt = publicIdSegments.join('/');
    const lastDot = withExt.lastIndexOf('.');

    if (lastDot === -1) return withExt;
    return withExt.slice(0, lastDot);
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

const buildTransformedUrl = (
  cloudName: string,
  publicId: string,
  overlay: { type: 'public_id' | 'fetch_url'; value: string }
): string => {
  const encodedPublicId = encodeURIComponent(publicId).replace(/%2F/g, '/');
  const overlayLayer = overlay.type === 'public_id'
    ? `l_${encodeURIComponent(overlay.value).replace(/%2F/g, ':')}`
    : `l_fetch:${toBase64Url(overlay.value)}`;

  const transformations = [
    'e_make_transparent:12',
    'c_pad,w_1200,h_1200,b_white',
    `${overlayLayer},g_north_east,x_24,y_24,w_180,c_fit,o_100/fl_layer_apply`,
    'f_auto,q_auto',
  ];

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join('/')}/${encodedPublicId}`;
};

const ensureBrandLogoAsset = async (hasApiCredentials: boolean): Promise<boolean> => {
  const localLogoPath = path.join(process.cwd(), 'public', 'logo.png');
  await access(localLogoPath);

  if (hasApiCredentials) {
    try {
      await cloudinary.api.resource(BRAND_LOGO_PUBLIC_ID);
      return true;
    } catch {
      await cloudinary.uploader.upload(localLogoPath, {
        public_id: BRAND_LOGO_PUBLIC_ID,
        overwrite: true,
        resource_type: 'image',
        folder: '',
        use_filename: false,
        unique_filename: false,
      });
      return true;
    }
  }

  return false;
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

    const hasApiCredentials = Boolean(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

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

    const logoInCloudinary = await ensureBrandLogoAsset(hasApiCredentials);
    const requestOrigin = req.nextUrl.origin;
    const logoFetchUrl = requestOrigin.includes('localhost')
      ? LOGO_FETCH_FALLBACK_URL
      : `${requestOrigin}/logo.png`;

    const transformedUrl = buildTransformedUrl(
      cloudName,
      publicId,
      logoInCloudinary
        ? { type: 'public_id', value: BRAND_LOGO_PUBLIC_ID }
        : { type: 'fetch_url', value: logoFetchUrl }
    );

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
