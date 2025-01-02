import Razorpay from "razorpay";
import mongoose from "mongoose";
import { connectToDB } from "@/utils/database";
import Donation from "@/models/donations";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {





  if (req.method === "POST") {
    const { fundraiserID, userID, amount } = req.body;

    if (!fundraiserID || !userID || !amount) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    try {
      const token =await req.cookies.get("authToken");
  console.log("token is",token);
  if(!token){
    return NextResponse.json({
      error:"Unauthorised:Token not provided"
    },{status:401});
  }
  let decoded;
  try{
    decoded= verifyToken(token.value);
    console.log(decoded);
  }catch (err){
    return NextResponse.json(
      {error:"Invalid or expired token"},
      {status:401}
    );
  }
  const userID=decoded.id;
        await connectToDB();
      // Create Razorpay Order
      const options = {
        amount: amount * 100, // Amount in paise
        currency: "INR",
        receipt: `receipt_${Math.random() * 10000}`,
      };
      const order = await razorpay.orders.create(options);

      // Save Donation details in MongoDB
      const donation = new Donation({
        donationID: order.id,
        fundraiserID: fundraiserID,
        userID:userID ,
        amount: amount,
        paymentStatus: "pending",
        orderID: order.id,
      });
      await donation.save();

      res.status(200).json({ success: true, order, donationID: donation._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
