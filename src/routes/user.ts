import express from "express";
import {
  DeleteUser,
  getAllUsers,
  getOneUser,
  newUser,
} from "../controllers/user.js";
import { AdminOnly } from "../middlewares/auth.js";

const app = express.Router();

//route
app.post("/new", newUser);

app.get("/all", AdminOnly, getAllUsers);

app.route("/:id").get(getOneUser).delete(AdminOnly, DeleteUser);

export default app;
