import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You cannot update someone else's profile!"));
  }
  if (
    req.body.username?.trim() === "" &&
    req.body.email?.trim() === "" &&
    req.body.password?.trim() === ""
  ) {
    return next(errorHandler(400, "No changes entered"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      },
      {
        new: true,
      }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  const cookies = req.cookies.access_token;
  if (!cookies) return next(errorHandler(401, "You are not logged in!"));
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You cannot update someone's else account!"));
  await User.findByIdAndDelete(req.user.id);
  res.status(200).json("User deleted successfully");
};
