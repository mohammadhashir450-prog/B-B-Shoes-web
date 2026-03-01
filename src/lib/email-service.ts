import nodemailer from 'nodemailer';

// Create transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(
  email: string,
  otp: string,
  name?: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"B&B Shoes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for B&B Shoes Login',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }
            .header {
              background: linear-gradient(135deg, #0047AB 0%, #003A8C 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #FFC107;
              margin: 0;
              font-size: 32px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .greeting {
              font-size: 20px;
              color: #0a192f;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              color: #555;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .otp-box {
              background: linear-gradient(135deg, #0047AB 0%, #0056D2 100%);
              border-radius: 15px;
              padding: 30px;
              margin: 30px 0;
              box-shadow: 0 5px 20px rgba(0,71,171,0.3);
            }
            .otp-code {
              font-size: 48px;
              font-weight: bold;
              color: #FFC107;
              letter-spacing: 8px;
              margin: 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .otp-label {
              color: white;
              font-size: 14px;
              margin-top: 10px;
              opacity: 0.9;
            }
            .expiry {
              color: #e74c3c;
              font-weight: bold;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              border-top: 3px solid #FFC107;
            }
            .footer p {
              color: #666;
              font-size: 14px;
              margin: 5px 0;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #FFC107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .warning p {
              color: #856404;
              margin: 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 B&B Shoes</h1>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hello ${name || 'Valued Customer'}! 👋
              </div>
              
              <p class="message">
                We received a request to access your B&B Shoes account. 
                Please use the following One-Time Password (OTP) to complete your login:
              </p>
              
              <div class="otp-box">
                <p class="otp-code">${otp}</p>
                <p class="otp-label">Your Verification Code</p>
              </div>
              
              <p class="expiry">⏰ This OTP will expire in 10 minutes</p>
              
              <div class="warning">
                <p>
                  <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. 
                  B&B Shoes will never ask for your OTP via phone or email.
                </p>
              </div>
              
              <p class="message">
                If you didn't request this code, please ignore this email 
                or contact our support team immediately.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>B&B Shoes - Premium Footwear</strong></p>
              <p>Your trusted partner for quality shoes</p>
              <p style="margin-top: 15px; color: #999; font-size: 12px;">
                This is an automated email. Please do not reply.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return false;
  }
}

// Send welcome email after registration
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"B&B Shoes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to B&B Shoes! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }
            .header {
              background: linear-gradient(135deg, #0047AB 0%, #003A8C 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #FFC107;
              margin: 0;
              font-size: 32px;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #0047AB;
              margin-bottom: 20px;
            }
            .content p {
              color: #555;
              line-height: 1.8;
              margin-bottom: 15px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
              color: #0a192f;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              margin: 20px 0;
              box-shadow: 0 5px 20px rgba(255,193,7,0.4);
            }
            .footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              border-top: 3px solid #FFC107;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to B&B Shoes!</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>
                Thank you for joining B&B Shoes! We're thrilled to have you as part 
                of our community.
              </p>
              
              <p>
                Explore our premium collection of footwear and enjoy:
              </p>
              
              <ul>
                <li>✨ Exclusive deals and discounts</li>
                <li>🚚 Fast and secure delivery</li>
                <li>💳 Secure payment options</li>
                <li>🎁 Special member benefits</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/home" class="button">
                  Start Shopping
                </a>
              </div>
              
              <p>
                If you have any questions, feel free to reach out to our support team.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>B&B Shoes - Premium Footwear</strong></p>
              <p>Your trusted partner for quality shoes</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return false;
  }
}

// Send password reset OTP email
export async function sendPasswordResetOTP(
  email: string,
  otp: string,
  name?: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"B&B Shoes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔒 Password Reset OTP - B&B Shoes',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }
            .header {
              background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 32px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .greeting {
              font-size: 20px;
              color: #0a192f;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              color: #555;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .otp-box {
              background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
              border-radius: 15px;
              padding: 30px;
              margin: 30px 0;
              box-shadow: 0 5px 20px rgba(231,76,60,0.3);
            }
            .otp-code {
              font-size: 48px;
              font-weight: bold;
              color: white;
              letter-spacing: 8px;
              margin: 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .otp-label {
              color: white;
              font-size: 14px;
              margin-top: 10px;
              opacity: 0.9;
            }
            .expiry {
              color: #e74c3c;
              font-weight: bold;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              border-top: 3px solid #e74c3c;
            }
            .footer p {
              color: #666;
              font-size: 14px;
              margin: 5px 0;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #FFC107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .warning p {
              color: #856404;
              margin: 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Password Reset Request</h1>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hello ${name || 'Valued Customer'}! 👋
              </div>
              
              <p class="message">
                We received a request to reset your B&B Shoes account password. 
                Please use the following One-Time Password (OTP) to proceed:
              </p>
              
              <div class="otp-box">
                <p class="otp-code">${otp}</p>
                <p class="otp-label">Your Password Reset Code</p>
              </div>
              
              <p class="expiry">⏰ This OTP will expire in 10 minutes</p>
              
              <div class="warning">
                <p>
                  <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. 
                  If you didn't request a password reset, please ignore this email 
                  and your password will remain unchanged.
                </p>
              </div>
              
              <p class="message">
                For security reasons, this OTP can only be used once to reset your password.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>B&B Shoes - Premium Footwear</strong></p>
              <p>Your account security is our priority</p>
              <p style="margin-top: 15px; color: #999; font-size: 12px;">
                This is an automated security email. Please do not reply.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset OTP email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset OTP email:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return false;
  }
}
