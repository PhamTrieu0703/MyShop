import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },

  description: String,
  image: String,
  imageAfter:[],
  category: String,
  sizes:[],
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },

  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })


export default mongoose.model("products", productSchema);