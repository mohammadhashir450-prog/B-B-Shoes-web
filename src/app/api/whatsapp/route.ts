import { NextRequest } from 'next/server'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse'
import {
  ADMIN_WHATSAPP_DISPLAY,
  ADMIN_WHATSAPP_E164,
  buildAdminOrderMessage,
  type WhatsAppOrderPayload,
} from '@/lib/whatsapp'

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

    // 2. Meta API Credentials (.env file se)
    const token = process.env.META_WA_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const adminWhatsAppNumber = "923068846624"; // Aapka verify kiya hua admin number

    if (!token || !phoneNumberId) {
      console.error("Missing Meta API Credentials in .env file");
      return errorResponse('WhatsApp API credentials are not configured properly.', 500)
    }

    // 3. Meta ko Server-to-Server POST request bhejein
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: adminWhatsAppNumber,
        type: "text",
        text: { body: whatsappMessage }
      })
    });

    const result = await response.json();

    // Agar Meta ki taraf se koi error aata hai
    if (!response.ok) {
      console.error("Meta API Error Details:", result);
      return errorResponse(result?.error?.message || 'Failed to send WhatsApp message via Meta API', 400);
    }

    // Agar message successfully chala jaye
    return successResponse(
      { 
        messageId: result.messages?.[0]?.id,
        adminWhatsappNumber: ADMIN_WHATSAPP_DISPLAY
      },
      'WhatsApp order alert sent successfully via API!'
    )

  } catch (error) {
    console.error("Internal Server Error in WhatsApp API:", error);
    const message = error instanceof Error ? error.message : 'Failed to process WhatsApp API request'
    return errorResponse(message, 500)
  }
}