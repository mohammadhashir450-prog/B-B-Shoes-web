import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '@/lib/email-service';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, otp, purpose = 'login', name, password } = body;

    // Validate inputs
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose,
      verified: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'OTP not found or expired' },
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

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return NextResponse.json(
        {
          success: false,
          message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    let user;

    if (purpose === 'register') {
      // Create new user
      if (!name || !password) {
        return NextResponse.json(
          { success: false, message: 'Name and password are required for registration' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        provider: 'email',
      });

      // Send welcome email
      await sendWelcomeEmail(email, name);
    } else {
      // Get existing user for login
      user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Clean up verified OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({
      success: true,
      message: purpose === 'register' ? 'Account created successfully!' : 'Login successful!',
      data: {
        token,
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
