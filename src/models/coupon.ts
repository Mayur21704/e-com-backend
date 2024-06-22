import mongoose from "mongoose";

const schema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "please Enter the Coupon Code"],
    unique: true,
  },
  amount: {
    type: Number,
    required: [true, "please Enter the discount Amount"],
  },
});

export const Coupon = mongoose.model("coupon", schema);
