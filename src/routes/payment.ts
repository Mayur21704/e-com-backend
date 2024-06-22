import express from "express";
import { AdminOnly } from "../middlewares/auth.js";
import {
  allCoupon,
  applyDiscount,
  createPAymentIntent,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.js";

const app = express.Router();

//route
app.post("/create", createPAymentIntent);

app.post("/coupon/new", AdminOnly, newCoupon);

app.get("/discount", applyDiscount);

app.get("/coupon/all", AdminOnly, allCoupon);

app.delete("/coupon/:id", AdminOnly, deleteCoupon);

export default app;
