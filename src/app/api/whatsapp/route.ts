import { NextRequest } from 'next/server'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse'
import {
  ADMIN_WHATSAPP_DISPLAY,
  ADMIN_WHATSAPP_E164,
  buildAdminOrderMessage,
  type WhatsAppOrderPayload,
} from '@/lib/whatsapp'
import { sendAdminWhatsAppMessage } from '@/lib/whatsappServer'

/**
 * GET /api/whatsapp
 * Returns configured admin WhatsApp metadata.
 */
export async function GET() {
  try {
    return successResponse(
      {
        adminWhatsappNumber: ADMIN_WHATSAPP_DISPLAY,
        adminWhatsappE164: ADMIN_WHATSAPP_E164,
      },
      'WhatsApp settings fetched successfully'
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch WhatsApp settings'
    return errorResponse(message, 500)
  }
}

/**
 * POST /api/whatsapp
 * Sends an automated WhatsApp alert to the Admin using Meta Cloud API.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Frontend se aane wala data (direct object ya 'order' key ke andar)
    const order = (body?.order || body) as WhatsAppOrderPayload | undefined

    if (!order) {
      return validationErrorResponse(['Provide order details to send alert.'])
    }

    // 1. Message ka text generate karein
    const whatsappMessage = buildAdminOrderMessage(order)

    // 2. Shared server sender use karte hain taake orders flow aur manual API flow consistent rahen.
    const dispatch = await sendAdminWhatsAppMessage(whatsappMessage)

    if (!dispatch.sent) {
      console.error('Meta API Error Details:', dispatch.error)
      return errorResponse(dispatch.error || 'Failed to send WhatsApp message via Meta API', 400)
    }

    // Agar message successfully chala jaye
    return successResponse(
      { 
        messageId: dispatch.messageId,
        adminWhatsappNumber: ADMIN_WHATSAPP_DISPLAY
      },
      'WhatsApp order alert sent successfully via API!'
    )

  } catch (error) {
    console.error("Internal Server Error in WhatsApp API:", error)
    const message = error instanceof Error ? error.message : 'Failed to process WhatsApp API request'
    return errorResponse(message, 500)
  }
}