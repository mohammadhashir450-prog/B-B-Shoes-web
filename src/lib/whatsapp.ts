export const ADMIN_WHATSAPP_DISPLAY = '03068846624'
export const ADMIN_WHATSAPP_E164 = '923068846624'

type WhatsAppOrderItem = {
  name?: string
  productName?: string
  quantity?: number
  size?: string
  color?: string
  price?: number
}

type WhatsAppOrderPayload = {
  orderId?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  customerAddress?: string
  paymentMethod?: string
  paymentStatus?: string
  subtotal?: number
  shippingFee?: number
  total?: number
  items?: WhatsAppOrderItem[]
}

const formatMoney = (value: number | undefined) => `PKR ${(Number(value) || 0).toLocaleString()}`

const formatItem = (item: WhatsAppOrderItem, index: number) => {
  const title = item.productName || item.name || 'Product'
  const quantity = Number(item.quantity) || 1
  const size = item.size ? `, Size: ${item.size}` : ''
  const color = item.color ? `, Color: ${item.color}` : ''
  const price = formatMoney(item.price)

  return `${index + 1}. ${title} x${quantity}${size}${color} - ${price}`
}

export const buildWhatsAppUrl = (phoneNumber: string, message: string) => {
  const digits = String(phoneNumber || '').replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export const buildAdminOrderMessage = (order: WhatsAppOrderPayload) => {
  const itemLines = (order.items || []).map((item, index) => formatItem(item, index))
  const lines = [
    'New Order Received',
    `Order ID: ${order.orderId || 'N/A'}`,
    `Customer: ${order.customerName || 'N/A'}`,
    `Phone: ${order.customerPhone || 'N/A'}`,
    `Email: ${order.customerEmail || 'N/A'}`,
    `Address: ${order.customerAddress || 'N/A'}`,
    `Payment Method: ${String(order.paymentMethod || 'cod').toUpperCase()}`,
    `Payment Status: ${String(order.paymentStatus || 'pending').toUpperCase()}`,
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Shipping: ${formatMoney(order.shippingFee)}`,
    `Total: ${formatMoney(order.total)}`,
    'Items:',
    ...(itemLines.length > 0 ? itemLines : ['No items found']),
  ]

  return lines.join('\n')
}

export const buildAdminOrderWhatsAppUrl = (order: WhatsAppOrderPayload) => {
  return buildWhatsAppUrl(ADMIN_WHATSAPP_E164, buildAdminOrderMessage(order))
}
