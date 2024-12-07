import { twilioClient, serviceSid } from '@/utils/twilioclient';
import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { generateToken } from '@/utils/jwt';
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json(); // Parse the request body
    const { phoneNumber, otp } = body;

    if (!phoneNumber || !otp) {
      console.error('Phone number or OTP is missing in the request body');
      return new Response(
        JSON.stringify({ error: 'Phone number and OTP are required' }),
        { status: 400 }
      );
    }

    const verificationCheck = await twilioClient.verify.v2.services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      let user = await User.findOne({ phoneNumber });
      if (!user) {
        user = new User({
          phoneNumber,
          isVerified: true,
        });
        await user.save();
      } else {
        user.isVerified = true;
        await user.save();
      }
      const token=generateToken(user);
      return new Response(JSON.stringify({token}),{status:200});
      
      console.log('OTP verified successfully for:', phoneNumber);
      return new Response(
        JSON.stringify({ message: 'OTP verified successfully' }),
        { status: 200 }
      );
    }

    console.warn('Invalid OTP for:', phoneNumber);
    return new Response(
      JSON.stringify({ error: 'Invalid OTP' }),
      { status: 400 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to verify OTP', details: error.message }),
      { status: 500 }
    );
  }
}
