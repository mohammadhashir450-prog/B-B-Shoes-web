import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';
import { generateOTP, sendOTPEmail, sendPasswordResetOTP } from '@/lib/email-service';
import { persistentStorage } from '@/lib/persistentStorage';

export async function POST(req: NextRequest) {
  let usingPersistentStorage = false;
  
  try {
    const body = await req.json();
    const { email, purpose = 'login' } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    let existingUser: any = null;
    let emailSent: boolean;
    const otp = generateOTP();

    try {
      // Try MongoDB first
      await dbConnect();
      
      existingUser = await User.findOne({ email: email.toLowerCase() });

      if (purpose === 'login' && !existingUser) {
        return NextResponse.json(
          { success: false, message: 'User not found. Please sign up first.' },
          { status: 404 }
        );
      }

      if (purpose === 'register' && existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email already registered. Please login.' },
          { status: 400 }
        );
      }

      if (purpose === 'password-reset' && !existingUser) {
        return NextResponse.json(
          { success: false, message: 'No account found with this email address.' },
          { status: 404 }
        );
      }

      // Delete any previous OTPs for this email/purpose
      await OTP.deleteMany({
        email: email.toLowerCase(),
        purpose,
        verified: false,
      });

      // Save OTP to database
      const otpDoc = new OTP({
        email: email.toLowerCase(),
        otp,
        purpose,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });

      await otpDoc.save();
      console.log('✅ OTP saved to MongoDB');

    } catch (dbError: any) {
      // MongoDB connection failed, use persistent storage
      console.log('⚠️ MongoDB unavailable, using persistent storage');
      usingPersistentStorage = true;

      // Check user in persistent storage
      const persistentUser = persistentStorage.getUser(email);

      if (purpose === 'login' && !persistentUser) {
        return NextResponse.json(
          { success: false, message: 'User not found. Please sign up first.' },
          { status: 404 }
        );
      }

      if (purpose === 'register' && persistentUser) {
        return NextResponse.json(
          { success: false, message: 'Email already registered. Please login.' },
          { status: 400 }
        );
      }

      if (purpose === 'password-reset' && !persistentUser) {
        return NextResponse.json(
          { success: false, message: 'No account found with this email address.' },
          { status: 404 }
        );
      }

      // Set existingUser for email template
      if (persistentUser) {
        existingUser = { name: persistentUser.name };
      }

      // Delete any previous OTPs
      persistentStorage.deleteOTP(email, purpose);

      // Save OTP to persistent storage
      persistentStorage.addOTP({
        email: email.toLowerCase(),
        otp,
        purpose: purpose as any,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      console.log('✅ OTP saved to persistent storage');
    }

    // Send OTP via email
    if (purpose === 'password-reset') {
      emailSent = await sendPasswordResetOTP(
        email,
        otp,
        existingUser?.name || undefined
      );
    } else {
      emailSent = await sendOTPEmail(
        email,
        otp,
        existingUser?.name || undefined
      );
    }

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${email}`,
      data: {
        email,
        expiresIn: 600, // seconds
        usingFallback: usingPersistentStorage,
      },
    });
    
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
