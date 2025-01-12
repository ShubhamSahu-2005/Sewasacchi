const mongoose = require('mongoose');

const verifiedCampSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fundraiserID:{type:String,required:true,unique:true},
    userID:{type:String,required:true,unique:true},
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    mobileNumber:{type:Number,required:true},
    raisedAmount: { type: Number, default: 0 },
    patientImage:{type:String,required:true},
    patientName:{type:String,required:true},
    medicalDocument:{type:String,required:true},
    bankDetails:{type:String,required:true},
    category: { type: String, required: true },
    story:{type:String,required:true},
    
    beneficiary: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['active', 'closed', 'completed'], default: 'active' },
  
    createdAt: { type: Date},
    verifiedAt:{type:Date},
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VerifiedCamp', verifiedCampSchema);
