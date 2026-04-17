import 'server-only'

import { ADMIN_WHATSAPP_E164 } from '@/lib/whatsapp'

type SendWhatsAppResult = {
  sent: boolean
  messageId?: string
  error?: string
}

type WhatsAppConfig = {
  token: string
  phoneNumberId: string
  recipient: string
}

const MAX_WA_TEXT_LENGTH = 3800

function firstNonEmpty(...values: Array<string | undefined>) {
  for (const value of values) {
    const normalized = String(value || '').trim()
    if (normalized) return normalized
  }
  return ''
}

function normalizeRecipient(input: string) {
  const digits = input.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('92') && digits.length >= 12) return digits
  if (digits.startsWith('0') && digits.length === 11) return `92${digits.slice(1)}`
  return digits
}

function getWhatsAppConfig(): WhatsAppConfig | null {
  const token = firstNonEmpty(
    process.env.META_WA_TOKEN,
    process.env.WHATSAPP_ACCESS_TOKEN,
    process.env.META_WHATSAPP_ACCESS_TOKEN,
  )

  const phoneNumberId = firstNonEmpty(
    process.env.META_PHONE_NUMBER_ID,
    process.env.WHATSAPP_PHONE_NUMBER_ID,
    process.env.META_WHATSAPP_PHONE_NUMBER_ID,
  )

  const recipientRaw = firstNonEmpty(
    process.env.META_ADMIN_WHATSAPP_TO,
    process.env.ADMIN_WHATSAPP_E164,
    ADMIN_WHATSAPP_E164,
  )

  const recipient = normalizeRecipient(recipientRaw)

  if (!token || !phoneNumberId || !recipient) {
    return null
  }

  return { token, phoneNumberId, recipient }
}

function sanitizeMessage(message: string) {
  const normalized = String(message || '').trim()
  if (!normalized) return ''
  if (normalized.length <= MAX_WA_TEXT_LENGTH) return normalized
  return `${normalized.slice(0, MAX_WA_TEXT_LENGTH)}\n\n...(message truncated)`
}

async function sendWhatsAppText(config: WhatsAppConfig, message: string): Promise<SendWhatsAppResult> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 12000)

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: config.recipient,
        type: 'text',
        text: { body: message },
      }),
      signal: controller.signal,
      cache: 'no-store',
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      const metaMessage = String(result?.error?.message || 'Failed to send WhatsApp message')
      const metaCode = result?.error?.code ? ` (code: ${result.error.code})` : ''
      const metaType = result?.error?.type ? ` [${result.error.type}]` : ''
      return {
        sent: false,
        error: `${metaMessage}${metaCode}${metaType}`,
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
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function sendAdminWhatsAppMessage(message: string): Promise<SendWhatsAppResult> {
  const config = getWhatsAppConfig()
  const finalMessage = sanitizeMessage(message)

  if (!config) {
    return {
      sent: false,
      error:
        'WhatsApp config missing. Set META_WA_TOKEN + META_PHONE_NUMBER_ID and optional META_ADMIN_WHATSAPP_TO.',
    }
  }

  if (!finalMessage) {
    return {
      sent: false,
      error: 'WhatsApp message body is empty',
    }
  }

  const firstTry = await sendWhatsAppText(config, finalMessage)
  if (firstTry.sent) return firstTry

  // One retry helps with transient Graph API/network failures.
  const secondTry = await sendWhatsAppText(config, finalMessage)
  if (secondTry.sent) return secondTry

  return {
    sent: false,
    error: secondTry.error || firstTry.error || 'Failed to send WhatsApp message after retry',
  }
}
