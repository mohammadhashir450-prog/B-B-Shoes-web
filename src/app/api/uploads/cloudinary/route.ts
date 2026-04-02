import { NextRequest } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function uploadToCloudinary(buffer: Buffer, folder: string) {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        resolve(result)
      }
    )

    stream.end(buffer)
  })
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return errorResponse('Cloudinary credentials are not configured', 500)
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const folder = String(formData.get('folder') || 'bb_shoes/seasonal-banners')

    if (!(file instanceof File)) {
      return validationErrorResponse(['Image file is required'])
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return validationErrorResponse(['Only JPG, PNG, and WEBP images are allowed'])
    }

    const maxSizeBytes = 5 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return validationErrorResponse(['Image size must be 5MB or less'])
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadToCloudinary(buffer, folder)

    return successResponse(
      {
        secureUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
      'Image uploaded successfully'
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload image'
    console.error('Cloudinary upload error:', message)
    return errorResponse(message, 500)
  }
}