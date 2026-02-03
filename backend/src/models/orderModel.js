import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      name: String,
      price: Number,
      quantity: Number,
      image:String
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    enum: ["cod", "bank", "momo", "card"], // ✅ FIX
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "paid", "shipping", "completed", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("orders", orderSchema);
