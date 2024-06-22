import express from "express";
import {
  DeleteProduct,
  NewProduct,
  UpdateProduct,
  getAdminProducts,
  getAllCategory,
  getAllProducts,
  getLatestProduct,
  getSingleProducts,
} from "../controllers/product.js";
import { AdminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", AdminOnly, singleUpload, NewProduct);

app.get("/all", getAllProducts);

app.get("/latest", getLatestProduct);

app.get("/category", getAllCategory);

app.get("/admin", AdminOnly, getAdminProducts);

app
  .route("/:id")
  .get(getSingleProducts)
  .put(AdminOnly, singleUpload, UpdateProduct)
  .delete(AdminOnly, DeleteProduct);

export default app;
