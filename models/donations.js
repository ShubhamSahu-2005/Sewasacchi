const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationId:{type:String,required:true,unique:true},
  fundraiserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fundraiser', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true }, // Optional for anonymous donations
  donorName: { type: String, default: 'Anonymous' },
  amount: { type: Number, required: true },
  message: { type: String },
  paymentStatus: { type: String, enum: ['successful', 'pending', 'failed'], default: 'pending' },
  transactionId: { type: String },
  paymentMethod: { type: String, enum: ['credit_card', 'upi', 'bank_transfer'], default: 'upi' },
  donationDate: { type: Date, default: Date.now },
});

const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

export default Donation;
