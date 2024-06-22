import { User } from "../models/user.js";
import Errorhandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

//middleware to Admin Access
export const AdminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  if (!id) return next(new Errorhandler("Please Login", 401));

  const user = await User.findById(id);
  if (!user) return next(new Errorhandler("Invalid User", 401));

  if (user.role !== "admin")
    return next(new Errorhandler("Admin Not Found", 403));

  next();
});
