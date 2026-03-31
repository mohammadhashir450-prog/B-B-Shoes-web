import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const BRAND_LOGO_PUBLIC_ID = 'bb_brand_logo_main';
const FALLBACK_CLOUD_NAME = 'dt2ikjlfc';

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

const uploadBrandLogoUnsigned = async (cloudName: string): Promise<string> => {
  const localLogoPath = path.join(process.cwd(), 'public', 'logo.png');
  await access(localLogoPath);
  const fileBuffer = await readFile(localLogoPath);

  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer], { type: 'image/png' }), 'logo.png');
  formData.append('upload_preset', 'bb_web');
  formData.append('public_id', BRAND_LOGO_PUBLIC_ID);
  formData.append('overwrite', 'true');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload logo via unsigned preset');
  }

  const result = await response.json();
  return String(result?.public_id || BRAND_LOGO_PUBLIC_ID);
};

const ensureBrandLogoAsset = async (cloudName: string, hasApiCredentials: boolean): Promise<string> => {
  const localLogoPath = path.join(process.cwd(), 'public', 'logo.png');
  await access(localLogoPath);

  if (hasApiCredentials) {
    try {
      await cloudinary.api.resource(BRAND_LOGO_PUBLIC_ID);
      return BRAND_LOGO_PUBLIC_ID;
    } catch {
      await cloudinary.uploader.upload(localLogoPath, {
        public_id: BRAND_LOGO_PUBLIC_ID,
        overwrite: true,
        resource_type: 'image',
        folder: '',
        use_filename: false,
        unique_filename: false,
      });
      return BRAND_LOGO_PUBLIC_ID;
    }
  }

  return uploadBrandLogoUnsigned(cloudName);
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

    const overlayPublicId = await ensureBrandLogoAsset(cloudName, hasApiCredentials);

    const transformation: Array<Record<string, any>> = [
      {
        // Remove background around product so only outside area becomes white.
        effect: 'background_removal',
      },
      {
        width: 1200,
        height: 1200,
        crop: 'pad',
        background: 'white',
      },
      {
        overlay: overlayPublicId,
        gravity: 'north_east',
        x: 24,
        y: 24,
        width: 180,
        crop: 'fit',
        opacity: 100,
      },
      {
      fetch_format: 'auto',
      quality: 'auto',
      },
    ];

    const transformedUrl = cloudinary.url(publicId, {
      secure: true,
      transformation,
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
