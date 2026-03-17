import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

async function generateUniqueUserId(): Promise<string> {
  let nextId = `USR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  while (await User.findOne({ user_id: nextId }).select('_id')) {
    nextId = `USR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
  return nextId;
}

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

    const generatedUserId = await generateUniqueUserId();
    console.log('🆔 Generated user_id:', generatedUserId);

    // Create new user in MongoDB
    const newUser = await User.create({
      user_id: generatedUserId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: 'credentials',
      role: 'user',
      isAdmin: false,
    });

    console.log('✅ User created in DB, user_id in response:', newUser.user_id);

    // Verify user_id was saved (for debugging)
    if (!newUser.user_id) {
      console.error('❌ CRITICAL: user_id is missing after creation!');
      const refetchedUser = await User.findById(newUser._id);
      console.log('🔍 Refetched user from DB:', { 
        _id: refetchedUser?._id, 
        user_id: refetchedUser?.user_id,
        email: refetchedUser?.email 
      });
    }

    const resolvedUserId = newUser.user_id || generatedUserId;
    console.log('✅ User registered successfully:', newUser.email, 'with user_id:', resolvedUserId);

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
