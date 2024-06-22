import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserReqBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import Errorhandler from "../utils/utility-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;

    let user = await User.findById(_id);

    if (user)
      return res.status(200).json({
        success: true,
        message: `Welcome ,${user.name}`,
      });

    if (!_id || !name || !email || !photo || !gender || !dob) {
      return next(new Errorhandler("Please Add All Field", 400));
    }
    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    return res.status(201).json({
      succes: true,
      message: `Welcome ,${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  return res.status(201).json({
    succes: true,
    users,
  });
});

export const getOneUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return next(new Errorhandler("Invalid Id", 400));
  return res.status(201).json({
    succes: true,
    user,
  });
});

export const DeleteUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return next(new Errorhandler("Invalid Id", 400));

  await user.deleteOne();

  return res.status(200).json({
    succes: true,
    message: "User Deleted Successfully",
  });
});
