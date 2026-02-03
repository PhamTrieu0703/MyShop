import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  fullName: String,
  phone: String,
  avatar: String,

  address: String,
    

  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },

  lastLogin: Date,
  resetPasswordCode: String,
  resetPasswordExpire: Date
}, { timestamps: true })

export default mongoose.model("users", userSchema);