import nodemailer from 'nodemailer';

// 1. Transporter Configuration (Lazy Initialization to ensure env is loaded)
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    console.log('✉️ Initializing Nodemailer transporter for B&B Shoes...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_APP_PASSWORD Length:', process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.length : 0);
    
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Verify connection
    transporter.verify((error) => {
      if (error) {
        console.error('❌ Email Transporter Error. Check your App Password in .env:', error);
      } else {
        console.log('✅ Email server is ready for B&B Shoes');
      }
    });
  }
  return transporter;
}

// Helper: Generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Generic Email Sender
async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const activeTransporter = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || `"B&B Shoes" <${process.env.EMAIL_USER}>`;
    await activeTransporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error(`❌ Email Failed to ${to}:`, error);
    return false;
  }
}

// 2. Send Login/General OTP Email
export async function sendOTPEmail(email: string, otp: string, name?: string): Promise<boolean> {
  const html = `
    <div style="font-family: sans-serif; text-align: center; padding: 20px;">
      <h2>B&B Shoes Verification</h2>
      <p>Hello ${name || 'Customer'}, your OTP is:</p>
      <h1 style="color: #0047AB; letter-spacing: 5px;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;
  return await sendMail(email, 'Your OTP for B&B Shoes', html);
}

// 3. Send Password Reset OTP Email
export async function sendPasswordResetOTP(email: string, otp: string, name?: string): Promise<boolean> {
  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
      <div style="background: #e74c3c; color: white; padding: 20px; text-align: center;">
        <h2>Password Reset Request</h2>
      </div>
      <div style="padding: 20px; text-align: center;">
        <p>Hello ${name || 'Customer'}, use the code below to reset your password:</p>
        <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h1 style="color: #e74c3c; margin: 0; letter-spacing: 10px;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;
  return await sendMail(email, '🔒 Password Reset OTP - B&B Shoes', html);
}

// 4. Send Welcome Email
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const html = `<div style="text-align: center;"><h1>Welcome to B&B Shoes, ${name}! 🎉</h1></div>`;
  return await sendMail(email, 'Welcome to B&B Shoes!', html);
}

// ─── Helper ───────────────────────────────────────────────────────────────────
/** Admin email recipient — falls back to bandb21032024@gmail.com */
export function getAdminEmail(): string {
  return (
    process.env.ADMIN_EMAIL ||
    process.env.CONTACT_EMAIL ||
    process.env.EMAIL_USER ||
    'bandb21032024@gmail.com'
  ).trim();
}

// 5. Send Admin Order Notification Email
export interface AdminOrderEmailPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    productId?: string;
    productName: string;
    productImage?: string;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDetails?: Record<string, any>;
}

function formatPaymentMethod(method: string): string {
  const map: Record<string, string> = {
    cod: 'Cash on Delivery',
    jazzcash: 'JazzCash',
    bank: 'Bank Transfer',
    card: 'Credit / Debit Card',
    easypaisa: 'EasyPaisa',
    stripe: 'Stripe',
    paypal: 'PayPal',
  };
  return map[String(method).toLowerCase()] || method;
}

function buildPaymentDetailsHtml(method: string, details?: Record<string, any>): string {
  if (!details) return '';
  const m = String(method).toLowerCase();
  const d = details[m];
  if (!d || typeof d !== 'object') return '';

  const rows: string[] = [];
  if (m === 'jazzcash') {
    if (d.senderNumber) rows.push(`<tr><td style="color:#888;padding:4px 0">Sender Number</td><td style="font-weight:600">${d.senderNumber}</td></tr>`);
    if (d.transactionId) rows.push(`<tr><td style="color:#888;padding:4px 0">Transaction ID</td><td style="font-weight:600">${d.transactionId}</td></tr>`);
  } else if (m === 'bank') {
    if (d.bankName) rows.push(`<tr><td style="color:#888;padding:4px 0">Bank</td><td style="font-weight:600">${d.bankName}</td></tr>`);
    if (d.senderAccountNumber) rows.push(`<tr><td style="color:#888;padding:4px 0">Sender Account</td><td style="font-weight:600">${d.senderAccountNumber}</td></tr>`);
    if (d.transactionId) rows.push(`<tr><td style="color:#888;padding:4px 0">Transaction ID</td><td style="font-weight:600">${d.transactionId}</td></tr>`);
  } else if (m === 'cod') {
    if (d.city) rows.push(`<tr><td style="color:#888;padding:4px 0">City</td><td style="font-weight:600">${d.city}</td></tr>`);
  } else if (m === 'card') {
    if (d.cardHolderName) rows.push(`<tr><td style="color:#888;padding:4px 0">Card Holder</td><td style="font-weight:600">${d.cardHolderName}</td></tr>`);
    if (d.cardMasked || d.cardLast4) rows.push(`<tr><td style="color:#888;padding:4px 0">Card</td><td style="font-weight:600">${d.cardMasked || `**** ${d.cardLast4}`}</td></tr>`);
  }
  if (!rows.length) return '';
  return `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:4px">${rows.join('')}</table>`;
}

export async function sendAdminOrderEmail(payload: AdminOrderEmailPayload): Promise<boolean> {
  const adminEmail = getAdminEmail();
  if (!adminEmail) {
    console.warn('⚠️ ADMIN_EMAIL not set — skipping admin order email');
    return false;
  }

  const {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    items,
    subtotal,
    shippingFee,
    total,
    paymentMethod,
    paymentStatus,
    paymentDetails,
  } = payload;

  const now = new Date().toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:12px 8px;vertical-align:middle">
          ${
            item.productImage
              ? `<img src="${item.productImage}" alt="${item.productName}" width="54" height="54"
                  style="border-radius:8px;object-fit:cover;display:block;border:1px solid #eee" />`
              : `<div style="width:54px;height:54px;border-radius:8px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:20px">👟</div>`
          }
        </td>
        <td style="padding:12px 8px;vertical-align:middle">
          <div style="font-weight:700;color:#1a1a1a;font-size:14px">${item.productName}</div>
          <div style="font-size:12px;color:#888;margin-top:2px">
            ${[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' &nbsp;·&nbsp; ')}
          </div>
        </td>
        <td style="padding:12px 8px;vertical-align:middle;text-align:center;color:#555;font-size:13px">×${item.quantity}</td>
        <td style="padding:12px 8px;vertical-align:middle;text-align:right;font-weight:700;color:#1a1a1a;white-space:nowrap">
          PKR ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join('');

  const paymentDetailsHtml = buildPaymentDetailsHtml(paymentMethod, paymentDetails);

  const statusColor = paymentStatus === 'paid' ? '#22c55e' : '#f59e0b';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'Segoe UI',Arial,sans-serif">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#0A0C14 0%,#1A1F35 100%);padding:28px 32px;text-align:center">
      <div style="font-size:26px;font-weight:900;color:#D4AF37;letter-spacing:0.06em;margin-bottom:4px">B&amp;B SHOES</div>
      <div style="font-size:12px;color:#fff;opacity:0.5;letter-spacing:0.2em;text-transform:uppercase">Admin Order Alert</div>
    </td>
  </tr>

  <!-- Alert Banner -->
  <tr>
    <td style="background:#FFF8E7;border-left:4px solid #D4AF37;padding:14px 32px">
      <div style="font-size:16px;font-weight:800;color:#7A5A00">🛍️ New Order Received!</div>
      <div style="font-size:12px;color:#A07830;margin-top:2px">${now} &nbsp;·&nbsp; Pakistan Standard Time</div>
    </td>
  </tr>

  <!-- Order ID -->
  <tr>
    <td style="padding:24px 32px 0">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin-bottom:4px">Order ID</div>
            <div style="font-size:22px;font-weight:900;color:#0A0C14;font-family:monospace">${orderId}</div>
          </td>
          <td align="right" valign="top">
            <div style="display:inline-block;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;background:${statusColor}20;color:${statusColor};border:1px solid ${statusColor}40">
              Payment: ${paymentStatus.toUpperCase()}
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Customer Info -->
  <tr>
    <td style="padding:20px 32px 0">
      <div style="background:#F9FAFB;border:1px solid #EAEAEA;border-radius:12px;padding:18px 20px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin-bottom:12px;font-weight:700">Customer Information</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
          <tr>
            <td style="width:130px;color:#888;padding-bottom:8px;vertical-align:top">👤 Name</td>
            <td style="font-weight:700;color:#1a1a1a;padding-bottom:8px">${customerName}</td>
          </tr>
          <tr>
            <td style="color:#888;padding-bottom:8px;vertical-align:top">📧 Email</td>
            <td style="padding-bottom:8px"><a href="mailto:${customerEmail}" style="color:#0047AB;text-decoration:none">${customerEmail}</a></td>
          </tr>
          <tr>
            <td style="color:#888;padding-bottom:8px;vertical-align:top">📞 Phone</td>
            <td style="padding-bottom:8px"><a href="tel:${customerPhone}" style="color:#0047AB;text-decoration:none">${customerPhone}</a></td>
          </tr>
          <tr>
            <td style="color:#888;vertical-align:top">📍 Address</td>
            <td style="color:#1a1a1a">${customerAddress}</td>
          </tr>
        </table>
      </div>
    </td>
  </tr>

  <!-- Payment Info -->
  <tr>
    <td style="padding:16px 32px 0">
      <div style="background:#F9FAFB;border:1px solid #EAEAEA;border-radius:12px;padding:18px 20px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin-bottom:12px;font-weight:700">Payment Details</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
          <tr>
            <td style="width:130px;color:#888;padding-bottom:8px">💳 Method</td>
            <td style="font-weight:700;color:#1a1a1a;padding-bottom:8px">${formatPaymentMethod(paymentMethod)}</td>
          </tr>
          <tr>
            <td style="color:#888">✅ Status</td>
            <td style="font-weight:700;color:${statusColor}">${paymentStatus.toUpperCase()}</td>
          </tr>
        </table>
        ${paymentDetailsHtml}
      </div>
    </td>
  </tr>

  <!-- Items Table -->
  <tr>
    <td style="padding:20px 32px 0">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin-bottom:10px;font-weight:700">Ordered Items</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #EAEAEA;border-radius:12px;overflow:hidden">
        <thead>
          <tr style="background:#F3F4F6">
            <th style="padding:10px 8px;text-align:left;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em">Product</th>
            <th style="padding:10px 8px;text-align:left;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em">Details</th>
            <th style="padding:10px 8px;text-align:center;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em">Qty</th>
            <th style="padding:10px 8px;text-align:right;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em">Amount</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
    </td>
  </tr>

  <!-- Order Total -->
  <tr>
    <td style="padding:16px 32px 0">
      <div style="background:#0A0C14;border-radius:12px;padding:18px 20px">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#aaa">
          <tr>
            <td style="padding-bottom:8px">Subtotal</td>
            <td style="text-align:right;padding-bottom:8px;color:#ddd">PKR ${subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding-bottom:8px">Shipping</td>
            <td style="text-align:right;padding-bottom:8px;color:${shippingFee === 0 ? '#22c55e' : '#ddd'};font-weight:600">
              ${shippingFee === 0 ? 'FREE' : `PKR ${shippingFee.toLocaleString()}`}
            </td>
          </tr>
          <tr style="border-top:1px solid #ffffff15">
            <td style="padding-top:10px;font-size:16px;font-weight:900;color:#fff">Total</td>
            <td style="padding-top:10px;text-align:right;font-size:18px;font-weight:900;color:#D4AF37">PKR ${total.toLocaleString()}</td>
          </tr>
        </table>
      </div>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:24px 32px 28px;text-align:center;border-top:1px solid #f0f0f0;margin-top:20px">
      <div style="font-size:11px;color:#bbb;line-height:1.7">
        This is an automated alert from your <strong>B&amp;B Shoes</strong> store.<br>
        Login to your admin panel to manage this order.
      </div>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`;

  return await sendMail(
    adminEmail,
    `🛍️ New Order #${orderId} — PKR ${total.toLocaleString()} — ${customerName}`,
    html
  );
}