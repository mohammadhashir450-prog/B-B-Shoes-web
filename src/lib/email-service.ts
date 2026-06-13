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
    await activeTransporter.sendMail({
      from: `"B&B Shoes" <${process.env.EMAIL_USER}>`,
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