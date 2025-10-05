import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: String,
  colorName: String,
  size: String,
  stock: Number
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  imageURL: String,
  variants: [variantSchema]
});

export default mongoose.model("Product", productSchema);
