import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { access } from 'node:fs/promises';
import path from 'node:path';

const BRAND_LOGO_PUBLIC_ID = 'bb_brand_logo';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const parsePublicIdFromSecureUrl = (secureUrl: string): string | null => {
  try {
    const marker = '/image/upload/';
    const markerIndex = secureUrl.indexOf(marker);
    if (markerIndex === -1) return null;

    const afterUpload = secureUrl.slice(markerIndex + marker.length);
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const withoutTransform = withoutVersion.includes('/') ? withoutVersion : withoutVersion;
    const lastDot = withoutTransform.lastIndexOf('.');

    if (lastDot === -1) return withoutTransform;
    return withoutTransform.slice(0, lastDot);
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

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Cloudinary environment variables are not configured' },
        { status: 500 }
      );
    }

    const publicId = inputPublicId || parsePublicIdFromSecureUrl(secureUrl);
    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'Could not determine Cloudinary public_id from upload result' },
        { status: 400 }
      );
    }

    await ensureBrandLogoAsset();

    const transformedUrl = cloudinary.url(publicId, {
      secure: true,
      transformation: [
        {
          width: 1200,
          height: 1200,
          crop: 'pad',
          background: 'white',
        },
        {
          overlay: BRAND_LOGO_PUBLIC_ID,
          gravity: 'north_east',
          x: 24,
          y: 24,
          width: 150,
          crop: 'fit',
          opacity: 100,
        },
        {
          fetch_format: 'auto',
          quality: 'auto',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: transformedUrl,
        publicId,
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
