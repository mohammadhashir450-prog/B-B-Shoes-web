export const ADMIN_WHATSAPP_DISPLAY = '03068846624'
export const ADMIN_WHATSAPP_E164 = '923068846624'
const BRAND_NAME = 'B&B Shoes'
const WEBSITE_URL = 'bnbshoes.online'

export type WhatsAppOrderItem = {
  name?: string
  productName?: string
  quantity?: number
  size?: string
  color?: string
  price?: number
}

export type WhatsAppOrderPayload = {
  orderId?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  customerAddress?: string
  paymentDetails?: {
    cod?: {
      address?: string
      city?: string
    }
  }
  paymentMethod?: string
  paymentStatus?: string
  subtotal?: number
  shippingFee?: number
  total?: number
  items?: WhatsAppOrderItem[]
}

const formatMoney = (value: number | undefined) => `Rs${(Number(value) || 0).toFixed(2)}`

const formatItem = (item: WhatsAppOrderItem, index: number) => {
  const title = item.productName || item.name || 'Product'
  const quantity = Number(item.quantity) || 1
  const size = item.size ? ` - ${item.size}` : ''
  const color = item.color ? ` (${item.color})` : ''

  return `${index + 1}. ${title}${size}${color} x${quantity}`
}

const resolveAddressAndCity = (order: WhatsAppOrderPayload) => {
  const codAddress = String(order.paymentDetails?.cod?.address || '').trim()
  const codCity = String(order.paymentDetails?.cod?.city || '').trim()
  const customerAddress = String(order.customerAddress || '').trim()

  return {
    address: codAddress || customerAddress || 'N/A',
    city: codCity || 'N/A',
  }
}

export const buildAdminOrderMessage = (order: WhatsAppOrderPayload) => {
  const itemLines = (order.items || []).map((item, index) => formatItem(item, index))
  const orderedItemsText = itemLines.length > 0 ? itemLines.join('\n') : 'No items found'
  const { address, city } = resolveAddressAndCity(order)
  const customerName = String(order.customerName || 'Customer').trim()
  const orderId = String(order.orderId || 'N/A').trim()

  const lines = [
    `🚨 *New Order Received!* 🚨`,
    '',
    `A new order has been placed on ${BRAND_NAME}.`,
    '',
    '*Order Details*',
    `Order ID: ${orderId}`,
    `Customer: ${customerName}`,
    `Phone: ${order.customerPhone || 'N/A'}`,
    `Email: ${order.customerEmail || 'N/A'}`,
    `Address: ${address}`,
    `City: ${city}`,
    '',
    '*Items Ordered:*',
    `${orderedItemsText}`,
    '',
    `*Total Price:* ${formatMoney(order.total)}`,
    '',
    `Check admin panel for more details.`,
    WEBSITE_URL,
  ]

  return lines.join('\n')
}

export const buildWhatsAppUrl = (phoneNumber: string, message: string) => {
  const digits = String(phoneNumber || '').replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export const buildAdminOrderWhatsAppUrl = (order: WhatsAppOrderPayload) => {
  return buildWhatsAppUrl(ADMIN_WHATSAPP_E164, buildAdminOrderMessage(order))
}