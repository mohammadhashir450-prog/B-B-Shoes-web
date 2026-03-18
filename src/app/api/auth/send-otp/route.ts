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

    // 1. Basic Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase();
    let existingUser: any = null;

    // 2. Fetch User (Try MongoDB first, fallback to Persistent Storage)
    try {
      await dbConnect();
      existingUser = await User.findOne({ email: cleanEmail });
    } catch (dbError) {
      console.log('⚠️ MongoDB unavailable, using persistent storage');
      usingPersistentStorage = true;
      existingUser = persistentStorage.getUser(cleanEmail);
    }

    // 3. Validations Based on Purpose (Fail early)
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

    // 4. Generate OTP (Ab generate hoga jab sab checks pass ho jayenge)
    const otp = generateOTP();

    // 5. Save OTP to DB or Fallback Storage
    if (!usingPersistentStorage) {
      try {
        // Delete old unverified OTPs
        await OTP.deleteMany({ email: cleanEmail, purpose, verified: false });

        // Save new OTP
        await OTP.create({
          email: cleanEmail,
          otp,
          purpose,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });
        console.log('✅ OTP saved to MongoDB');
      } catch (saveError) {
        console.log('⚠️ Failed to save OTP to MongoDB, switching to fallback');
        usingPersistentStorage = true; // Agar save fail ho toh fallback active karo
      }
    }

    if (usingPersistentStorage) {
      persistentStorage.deleteOTP(cleanEmail, purpose);
      persistentStorage.addOTP({
        email: cleanEmail,
        otp,
        purpose: purpose as any,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      console.log('✅ OTP saved to persistent storage');
    }

    // 6. Send OTP via email
    let emailSent = false;
    const userName = existingUser?.name || undefined;

    if (purpose === 'password-reset') {
      emailSent = await sendPasswordResetOTP(cleanEmail, otp, userName);
    } else {
      emailSent = await sendOTPEmail(cleanEmail, otp, userName);
    }

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    // 7. Success Response
    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}`,
      data: {
        email: cleanEmail,
        expiresIn: 600, // 10 minutes in seconds
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