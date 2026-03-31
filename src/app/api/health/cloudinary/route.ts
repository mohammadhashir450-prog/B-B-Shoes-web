import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const FALLBACK_CLOUD_NAME = 'dt2ikjlfc';

export async function GET() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    FALLBACK_CLOUD_NAME;

  const hasApiKey = Boolean(process.env.CLOUDINARY_API_KEY);
  const hasApiSecret = Boolean(process.env.CLOUDINARY_API_SECRET);
  const uploadWidgetReady = Boolean(cloudName);
  const logoWatermarkReady = uploadWidgetReady && hasApiKey && hasApiSecret;

  let apiReachable: boolean | null = null;

  if (logoWatermarkReady) {
    try {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });

      await cloudinary.api.ping();
      apiReachable = true;
    } catch {
      apiReachable = false;
    }
  }

  const message = !uploadWidgetReady
    ? 'Cloudinary upload is not configured.'
    : logoWatermarkReady
      ? apiReachable === false
        ? 'Cloudinary keys found but API ping failed. Check credentials.'
        : 'Cloudinary upload and premium watermark processing are ready.'
      : 'Cloudinary upload is ready. Add API key + secret to enable logo watermark processing.';

  return NextResponse.json({
    success: true,
    data: {
      cloudName,
      uploadWidgetReady,
      logoWatermarkReady,
      apiReachable,
      hasApiKey,
      hasApiSecret,
      message,
    },
  });
}
