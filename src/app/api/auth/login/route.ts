import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { User } from '@/models';
import { asyncHandler, UnauthorizedError } from '@/lib/errorHandler';
import { successResponse, validationErrorResponse } from '@/lib/apiResponse';
import { validateLogin } from '@/lib/validation';
import { generateToken } from '@/lib/auth';
import { persistentStorage } from '@/lib/persistentStorage';

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export const POST = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email, password } = body;

  // Validate input
  const validation = validateLogin({ email, password });
  if (!validation.isValid) {
    return validationErrorResponse(validation.errors);
  }

  try {
    // Try MongoDB connection
    await connectDB();

    // Find user by email (include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
      isAdmin: user.isAdmin || false,
    });

    // Return user data without password
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      isAdmin: user.isAdmin || false,
      phone: user.phone,
      address: user.address,
      image: user.image,
      token,
    };

    console.log('✅ User logged in successfully (MongoDB):', user.email);
    return successResponse(userResponse, 'Login successful');

  } catch (dbError: any) {
    // MongoDB connection failed, use persistent storage authentication
    const persistentUser = persistentStorage.getUser(email);
    
    if (!persistentUser) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, persistentUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: email.toLowerCase(),
      email: persistentUser.email,
      role: 'user',
      isAdmin: false,
    });

    // Return user data
    const userResponse = {
      id: email.toLowerCase(),
      name: persistentUser.name,
      email: persistentUser.email,
      role: 'user' as const,
      isAdmin: false,
      token,
    };

    console.log('✅ User logged in successfully (Persistent Storage):', persistentUser.email);
    return successResponse(userResponse, 'Login successful');
  }
});
