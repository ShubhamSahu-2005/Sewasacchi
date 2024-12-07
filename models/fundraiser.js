const mongoose = require('mongoose');

const fundraiserSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  category: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  beneficiary: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['active', 'closed', 'completed'], default: 'active' },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Fundraiser = mongoose.models.Fundraiser || mongoose.model('Fundraiser', fundraiserSchema);

export default Fundraiser;
