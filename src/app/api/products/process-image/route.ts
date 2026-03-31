import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { access } from 'node:fs/promises';
import path from 'node:path';

const BRAND_LOGO_PUBLIC_ID = 'bb_brand_logo';
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

const ensureBrandLogoAsset = async () => {
  try {
    await cloudinary.api.resource(BRAND_LOGO_PUBLIC_ID);
    return;
  } catch {
    const localLogoPath = path.join(process.cwd(), 'public', 'images', 'logo.jpg');
    await access(localLogoPath);

    await cloudinary.uploader.upload(localLogoPath, {
      public_id: BRAND_LOGO_PUBLIC_ID,
      overwrite: true,
      resource_type: 'image',
      folder: '',
      use_filename: false,
      unique_filename: false,
    });
  }
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

    let watermarkMode: 'logo' | 'text' = 'text';

    if (hasApiCredentials) {
      await ensureBrandLogoAsset();
      watermarkMode = 'logo';
    }

    const transformation: Array<Record<string, any>> = [
      {
        width: 1200,
        height: 1200,
        crop: 'pad',
        background: 'white',
      },
    ];

    if (watermarkMode === 'logo') {
      transformation.push({
        overlay: BRAND_LOGO_PUBLIC_ID,
        gravity: 'north_east',
        x: 24,
        y: 24,
        width: 150,
        crop: 'fit',
        opacity: 100,
      });
    } else {
      transformation.push({
        overlay: {
          font_family: 'Arial',
          font_size: 74,
          font_weight: 'bold',
          text: 'B&B',
        },
        color: '#1A1A1A',
        gravity: 'north_east',
        x: 24,
        y: 24,
        opacity: 65,
      });
    }

    transformation.push({
      fetch_format: 'auto',
      quality: 'auto',
    });

    const transformedUrl = cloudinary.url(publicId, {
      secure: true,
      transformation,
    });

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: transformedUrl,
        publicId,
        logoApplied: watermarkMode === 'logo',
        watermarkMode,
      },
      message: watermarkMode === 'logo'
        ? 'Image processed with white background and B&B logo'
        : 'Image processed with white background and B&B watermark',
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
