import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * GET /api/users - Fetch all users
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all users
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        data: users,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ GET /api/users error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users - Create a new user
 * Body: { name: string, email: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and email are required',
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 409 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
    });

    // Return created user
    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ POST /api/users error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create user',
      },
      { status: 500 }
    );
  }
}
