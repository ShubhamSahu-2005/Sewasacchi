import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  userID:{type:String,required:true,unique:true},
  isVerified: { type: Boolean, default: false },
  AadharNumber: { type: String, default: "" },
  PanNumber: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  password:{type:String,required:true},
  role:{type:String,enum:['donor','fundraiser','admin'],default:'donor'}
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
