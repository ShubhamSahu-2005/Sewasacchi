import { twilioClient, serviceSid } from '@/utils/twilioclient';
import { connectToDB } from '@/utils/database';
import User from '@/models/user';
const { v4: uuidv4 } = require('uuid');
import { generateToken } from '@/utils/jwt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json(); // Parse the request body
    const { phoneNumber, otp } = body;

    if (!phoneNumber || !otp) {
      console.error('Phone number or OTP is missing in the request body');
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    const verificationCheck = await twilioClient.verify.v2.services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      let user = await User.findOne({ phoneNumber });
      if (!user) {
        user = new User({
          userID: uuidv4(),
          phoneNumber,
          isVerified: true,
        });
        await user.save();
      } else {
        user.isVerified = true;
        await user.save();
      }

      const token = generateToken(user);

      const response = NextResponse.json({
        message: 'Login Success',
        success: true,
        user: user,
      });

      // Set the cookie for authentication
      response.cookies.set('authToken', token, {
        maxAge: 24 * 60 * 60, // 1 day in seconds
        httpOnly: true,
         // Secure in production
        
      });

      console.log(user);
      console.log(token);
      console.log('OTP verified successfully for:', phoneNumber);

      return response;
    }

    console.warn('Invalid OTP for:', phoneNumber);
    return NextResponse.json(
      { error: 'Invalid OTP' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP', details: error.message },
      { status: 500 }
    );
  }
}

