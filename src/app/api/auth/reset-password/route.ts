import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import OTP from '@/models/OTP';
import bcrypt from 'bcryptjs';
import { persistentStorage } from '@/lib/persistentStorage';

/**
 * POST /api/auth/reset-password
 * Reset user password after OTP verification
 */
export async function POST(req: NextRequest) {
  let usingPersistentStorage = false;
  
  try {
    const body = await req.json();
    const { email, otp, newPassword } = body;

    // Validate inputs
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email, OTP, and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    try {
      // Try MongoDB first
      await dbConnect();

      // Find and verify OTP
      const otpRecord = await OTP.findOne({
        email: email.toLowerCase(),
        purpose: 'password-reset',
        verified: false,
      }).sort({ createdAt: -1 });

      if (!otpRecord) {
        return NextResponse.json(
          { success: false, message: 'OTP not found or already used' },
          { status: 404 }
        );
      }

      // Check if OTP is expired
      if (new Date() > otpRecord.expiresAt) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return NextResponse.json(
          { success: false, message: 'OTP has expired. Please request a new one.' },
          { status: 400 }
        );
      }

      // Verify OTP
      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        
        if (otpRecord.attempts >= 5) {
          await OTP.deleteOne({ _id: otpRecord._id });
          return NextResponse.json(
            { success: false, message: 'Too many failed attempts. Please request a new OTP.' },
            { status: 429 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
          },
          { status: 400 }
        );
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      user.password = hashedPassword;
      await user.save();

      // Delete OTP
      await OTP.deleteOne({ _id: otpRecord._id });

      console.log('✅ Password reset using MongoDB');

    } catch (dbError: any) {
      console.log('❌ MongoDB unavailable for password reset:', dbError.message || dbError);
      return NextResponse.json(
        { success: false, message: 'Password reset requires database connection. Please try again shortly.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now login with your new password.',
      data: {
        email: email.toLowerCase(),
        usingFallback: usingPersistentStorage,
      },
    });
    
  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
