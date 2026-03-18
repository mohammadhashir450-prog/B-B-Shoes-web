import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '@/lib/email-service';
import { persistentStorage } from '@/lib/persistentStorage'; // Fallback import kiya

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Yahan 'password' naya account banane ke liye YA reset karne ke liye (New Password) use hoga
    const { email, otp, purpose = 'login', name, password } = body;

    // 1. Validate inputs
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase();
    let otpRecord = null;
    let usingPersistentStorage = false;

    // 2. Try DB first, Fallback to Persistent Storage
    try {
      await dbConnect();
      otpRecord = await OTP.findOne({
        email: cleanEmail,
        purpose,
        verified: false,
      }).sort({ createdAt: -1 });
    } catch (dbError) {
      console.log('⚠️ MongoDB unavailable, checking persistent storage');
      usingPersistentStorage = true;
      otpRecord = persistentStorage.getOTP(cleanEmail, purpose);
    }

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'OTP not found or expired' },
        { status: 404 }
      );
    }

    // 3. Check if OTP is expired
    if (new Date() > new Date(otpRecord.expiresAt)) {
      if (!usingPersistentStorage) await OTP.deleteOne({ _id: otpRecord._id });
      else persistentStorage.deleteOTP(cleanEmail, purpose);

      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // 4. Check attempts
    if (otpRecord.attempts >= 5) {
      if (!usingPersistentStorage) await OTP.deleteOne({ _id: otpRecord._id });
      else persistentStorage.deleteOTP(cleanEmail, purpose);

      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // 5. Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      
      // Safe check: Only use .save() if it's a MongoDB document
      if (typeof otpRecord.save === 'function') {
        await otpRecord.save();
      }

      return NextResponse.json(
        {
          success: false,
          message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // 6. Mark OTP as verified
    if (typeof otpRecord.save === 'function') {
      otpRecord.verified = true;
      await otpRecord.save();
    }

    let user;
    let responseMessage = '';

    // ==========================================
    // 7. PURPOSE KE HISAAB SE LOGIC (MAIN UPDATE)
    // ==========================================

    if (purpose === 'register') {
      // --- REGISTER LOGIC ---
      if (!name || !password) {
        return NextResponse.json(
          { success: false, message: 'Name and password are required for registration' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: 'user',
        provider: 'email',
      });

      await sendWelcomeEmail(cleanEmail, name);
      responseMessage = 'Account created successfully!';

    } else if (purpose === 'password-reset') {
      // --- NAYA PASSWORD RESET LOGIC ---
      if (!password) {
        return NextResponse.json(
          { success: false, message: 'New password is required to reset' },
          { status: 400 }
        );
      }

      user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      // Naya password hash karo aur DB mein save karo
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      responseMessage = 'Password reset successfully! Logging you in...';

    } else {
      // --- NORMAL LOGIN LOGIC ---
      user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      responseMessage = 'Login successful!';
    }

    // 8. Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // 9. Clean up verified OTP
    if (!usingPersistentStorage) {
      await OTP.deleteOne({ _id: otpRecord._id });
    } else {
      persistentStorage.deleteOTP(cleanEmail, purpose);
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
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