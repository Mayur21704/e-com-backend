import express from "express";
import { AdminOnly } from "../middlewares/auth.js";
import {
  DeleteOrder,
  ProcessOrder,
  allorder,
  getSingleOrder,
  myOrder,
  newOrder,
} from "../controllers/order.js";

const app = express.Router();

//route
app.post("/new", newOrder);

app.get("/my", myOrder);

app.get("/all", AdminOnly, allorder);

app
  .route("/:id")
  .get(getSingleOrder)
  .put(AdminOnly, ProcessOrder)
  .delete(AdminOnly, DeleteOrder);

export default app;
