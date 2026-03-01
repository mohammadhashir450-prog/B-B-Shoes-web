import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * POST /api/auth/register
 * Register a new user account
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    console.log('📝 Registration attempt:', { name, email });

    // Validate input
    if (!name || !email || !password) {
      console.log('❌ Validation failed: Missing fields');
      return NextResponse.json(
        { error: 'Please provide all required fields (name, email, password)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✅ Password hashed');

    // Create new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: 'credentials',
      role: 'user',
      isAdmin: false,
    });

    console.log('✅ User created successfully:', newUser.email);

    // Return success response (don't return password)
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
