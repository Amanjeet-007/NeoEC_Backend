import mongoose from "mongoose";

const image = new mongoose.Schema(
  {
    name: String,
    fileId: String,
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: [image], // multiple product images
      default: [],
    },
    brand: {
      type: String,
      default: "Generic",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: String,
      },
    ],
    reviews: { type: [mongoose.Schema.Types.ObjectId], ref: "Reviews" },
  },
  { timestamps: true },
);
productSchema.index({
  name: "text",
  description: "text",
});

export const Product = mongoose.model("Product", productSchema);
