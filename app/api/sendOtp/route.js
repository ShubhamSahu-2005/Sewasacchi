import { twilioClient, serviceSid } from '@/utils/twilioclient';

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body
    const { phoneNumber } = body;

    if (!phoneNumber) {
      console.error('Phone number is missing in the request body');
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400 }
      );
    }

    const verification = await twilioClient.verify.v2.services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });

    console.log('OTP sent successfully:', verification);

    return new Response(
      JSON.stringify({ message: 'OTP sent successfully', verification }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send OTP', details: error.message }),
      { status: 500 }
    );
  }
}
