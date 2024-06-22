import express from "express";
import { config } from "dotenv";
import morgan from "morgan";

import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/features.js";
import NodeCache from "node-cache";
import Stripe from "stripe";
import cors from "cors";

import userRoute from "./routes/user.js";
import ProductRoute from "./routes/products.js";
import OrderRoute from "./routes/order.js";
import PaymentRoute from "./routes/payment.js";
import DashboardRoute from "./routes/stats.js";

const app = express();

config({
  path: "./.env",
});

const port = process.env.PORT || 4000;
const uri = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";

//database connection
connectDB(uri);

export const stripe = new Stripe(stripeKey);
export const nodeCache = new NodeCache();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "https://e-com-frontend-ifqxhoosr-mayur-chauhan-project.vercel.app",
    ],
    credentials: true,
  })
);

//Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", ProductRoute);
app.use("/api/v1/order", OrderRoute);
app.use("/api/v1/payment", PaymentRoute);
app.use("/api/v1/dashboard", DashboardRoute);

app.get("/", (req, res) => {
  res.status(200).send("Helloji");
});

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
