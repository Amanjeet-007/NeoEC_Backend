import mongoose from "mongoose";

const product = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
}); // for cart

const OTP = new mongoose.Schema({
  value:String,
  exptime:{
    type: Number,
    default:Date.now
  }
})

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "http://", // user avatar or image
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      // required: true
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["seller", "user"],
      default: "user",
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
    },
    address: {
      fullName: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: "India",
      },
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    paymentMethods: [
      {
        name: String, // "UPI", "Card", "COD"
        provider: String, // "Razorpay", "Visa", "GPay"
        last4: String, // for cards
      },
    ],
    cart: [product],
    varified: {
      type: Boolean,
      default: false,
    },
    emailOTP:OTP,
    notify:[
      {
        type:String,
      }
    ],
    recentSearches: [
    {
        keyword: String,
        searchedAt: {
            type: Date,
            default: Date.now
        }
    }
]
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
