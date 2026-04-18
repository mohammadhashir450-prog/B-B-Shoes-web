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

export type WhatsAppCustomerMessageContext = {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  orderId?: string
  productName?: string
  itemsSummary?: string
  orderStatus?: string
  paymentMethod?: string
  total?: number
  note?: string
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
  const paymentMethod = String(order.paymentMethod || 'cod').toUpperCase()
  const paymentStatus = String(order.paymentStatus || 'pending').toUpperCase()
  const subtotal = formatMoney(order.subtotal)
  const shippingFee = formatMoney(order.shippingFee)
  const total = formatMoney(order.total)

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
    `Payment Method: ${paymentMethod}`,
    `Payment Status: ${paymentStatus}`,
    '',
    '*Items Ordered:*',
    `${orderedItemsText}`,
    '',
    `Subtotal: ${subtotal}`,
    `Shipping Fee: ${shippingFee}`,
    `*Total Price:* ${total}`,
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

/**
 * Default customer message when initiating chat with admin.
 * Mirrors the order-alert style so customer chats look professional and structured.
 */
export const buildCustomerDefaultMessage = (context: WhatsAppCustomerMessageContext = {}): string => {
  const customerName = String(context.customerName || 'Customer').trim()
  const customerEmail = String(context.customerEmail || 'N/A').trim()
  const customerPhone = String(context.customerPhone || 'N/A').trim()
  const orderId = String(context.orderId || '').trim()
  const productName = String(context.productName || '').trim()
  const itemsSummary = String(context.itemsSummary || '').trim()
  const orderStatus = String(context.orderStatus || '').trim()
  const paymentMethod = String(context.paymentMethod || '').trim()
  const note = String(context.note || '').trim()

  const lines = [
    `🚨 *Customer Support Request!* 🚨`,
    '',
    `A customer has started a WhatsApp chat on ${BRAND_NAME}.`,
    '',
    '*Customer Details*',
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Email: ${customerEmail}`,
  ]

  if (orderId || productName || itemsSummary || orderStatus || paymentMethod) {
    lines.push(
      '',
      '*Order / Product Details*',
      `Order ID: ${orderId || 'N/A'}`,
      `Product: ${productName || 'N/A'}`,
      `Items: ${itemsSummary || 'N/A'}`,
      `Order Status: ${orderStatus || 'N/A'}`,
      `Payment Method: ${paymentMethod || 'N/A'}`,
    )
  }

  lines.push(
    '',
    '*Message*',
    note || 'Please assist me with my order, product, payment, or delivery details.',
    '',
    `Check admin panel for more details.`,
    WEBSITE_URL,
  )

  return lines.join('\n')
}