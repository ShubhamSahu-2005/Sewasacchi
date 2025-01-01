import Razorpay from "razorpay";
import mongoose from "mongoose";
import { connectToDB } from "@/utils/database";
import Donation from "@/models/donations";

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
        fundraiserID: mongoose.Types.ObjectId(fundraiserID),
        userID: mongoose.Types.ObjectId(userID),
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
