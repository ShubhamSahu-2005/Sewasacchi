import bcrypt from 'bcryptjs';
import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '@/utils/jwt';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { email, password, phoneNumber } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email or Password is missing' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: 'User already exists. Please log in.' },
        { status: 409 }
      );
    }

    // Create a new user
    user = new User({
      userID: uuidv4(),
      phoneNumber,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await user.save();

    // Generate a token for the user
    const token = generateToken(user);

    // Set cookie for the token
    const response = NextResponse.json(
      {
        message: 'Signup successful',
        token,
        user: { email: user.email, userID: user.userID },
      },
      { status: 201 }
    );

    response.cookies.set('authToken', token, {
      maxAge: 24 * 60 * 60, // 1 day in seconds
      httpOnly: true,
       // Secure in production
      
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to create account',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


