import Razorpay from "razorpay";
import crypto from "crypto";
import {connectToDB} from "@/utils/database"  // Utility to connect MongoDB
import Donation from "@/models/donations"; // Your Donation model
import Fundraiser from "@/models/fundraiser"; // Your Fundraiser model

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }


  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
await connectToDB();
    // Verify the Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Payment verified successfully
    const donation = await Donation.findOne({ razorpay_order_id });
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation record not found" });
    }

    // Update the donation record in the database
    donation.paymentStatus = "success";
    donation.razorpay_payment_id = razorpay_payment_id;
    await donation.save();

    // Update the fundraiser's raisedAmount
    const fundraiser = await Fundraiser.findById(donation.fundraiserID);
    if (fundraiser) {
      fundraiser.raisedAmount += donation.amount;
      await fundraiser.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and recorded successfully",
      donation,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}
