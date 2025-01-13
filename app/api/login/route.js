import bcrypt from 'bcryptjs';
import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { generateToken } from '@/utils/jwt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email or Password is missing' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }

    // Compare passwords
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user);

    // Set cookie with the token
    const response = NextResponse.json(
      {
        message: 'Signin successful',
        token,
        user: { email: user.email, userID: user.userID },
      },
      { status: 200 }
    );

    response.cookies.set('authToken', token, {
      maxAge: 24 * 60 * 60, // 1 day in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
