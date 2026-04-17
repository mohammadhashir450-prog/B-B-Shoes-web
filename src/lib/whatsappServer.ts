import 'server-only'

import { ADMIN_WHATSAPP_E164 } from '@/lib/whatsapp'

type SendWhatsAppResult = {
  sent: boolean
  messageId?: string
  error?: string
}

export async function sendAdminWhatsAppMessage(message: string): Promise<SendWhatsAppResult> {
  const token = process.env.META_WA_TOKEN
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    return {
      sent: false,
      error: 'WhatsApp credentials are missing (META_WA_TOKEN / META_PHONE_NUMBER_ID)',
    }
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: ADMIN_WHATSAPP_E164,
        type: 'text',
        text: { body: message },
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        sent: false,
        error: String(result?.error?.message || 'Failed to send WhatsApp message'),
      }
    }

    return {
      sent: true,
      messageId: String(result?.messages?.[0]?.id || ''),
    }
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Unexpected WhatsApp dispatch error',
    }
  }
}
