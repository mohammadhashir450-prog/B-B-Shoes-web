export const ADMIN_WHATSAPP_DISPLAY = '03068846624'
export const ADMIN_WHATSAPP_E164 = '923068846624'
const BRAND_NAME = 'B&B Shoes'
const WEBSITE_URL = 'bnbshoes.online'

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

  if (codAddress || codCity) {
    return {
      address: codAddress || String(order.customerAddress || '').trim() || 'N/A',
      city: codCity || 'N/A',
    }
  }

  const fullAddress = String(order.customerAddress || '').trim()
  if (!fullAddress) {
    return { address: 'N/A', city: 'N/A' }
  }

  const segments = fullAddress.split(',').map((segment) => segment.trim()).filter(Boolean)
  if (segments.length >= 2) {
    return {
      address: segments.slice(0, -1).join(', '),
      city: segments[segments.length - 1],
    }
  }

  return { address: fullAddress, city: 'N/A' }
}

export const buildWhatsAppUrl = (phoneNumber: string, message: string) => {
  const digits = String(phoneNumber || '').replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export const buildAdminOrderMessage = (order: WhatsAppOrderPayload) => {
  const itemLines = (order.items || []).map((item, index) => formatItem(item, index))
  const orderedItemsText = itemLines.length > 0 ? itemLines.join(' | ') : 'No items found'
  const { address, city } = resolveAddressAndCity(order)
  const customerName = String(order.customerName || 'Customer').trim()
  const orderId = String(order.orderId || 'N/A').trim()

  const lines = [
    `Hey ${customerName}`,
    '',
    `Your order has been successfully received on our website ${BRAND_NAME}.`,
    '',
    'Order Detail',
    `Order: ${orderId}`,
    `Address: ${address}`,
    `City: ${city}`,
    `Item Ordered : ${orderedItemsText}`,
    `Total Price : ${formatMoney(order.total)}`,
    '',
    'Delivery Information',
    'If the provided address is complete, your order will be dispatched promptly and delivered within 2-6 business days. Should there be any missing details, our team will contact you to confirm and update the necessary information.',
    'اگر فراہم کردہ پتہ مکمل ہے تو آپ کا آرڈر فوری طور پر بھیج دیا جائے گا اور یہ 2-6 کاروباری دنوں کے اندر پہنچا دیا جائے گا۔ کسی بھی تفصیل کی کمی کی صورت میں، ہماری ٹیم آپ سے رابطہ کرے گی۔',
    `Thank you for choosing ${BRAND_NAME}.`,
    WEBSITE_URL,
    '',
    `Customer Phone: ${order.customerPhone || 'N/A'}`,
    `Customer Email: ${order.customerEmail || 'N/A'}`,
  ]

  return lines.join('\n')
}

export const buildAdminOrderWhatsAppUrl = (order: WhatsAppOrderPayload) => {
  return buildWhatsAppUrl(ADMIN_WHATSAPP_E164, buildAdminOrderMessage(order))
}
