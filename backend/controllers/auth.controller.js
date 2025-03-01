import User from "../models/user.model.js";
import mongoose from "mongoose";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import generator from "generate-password";
import { generateFromEmail } from "unique-username-generator";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return next(
        errorHandler(400, `This ${field} "${value}" is already in use.`)
      );
    }
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    console.log("Database connection state:", mongoose.connection.readyState);
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "No user found!"));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const oauth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
    if (!user) {
      const generatedUsername = generateFromEmail(req.body.email, 4);
      const generatedPassword = generator.generate({
        length: 10,
        numbers: true,
      });
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        email: req.body.email,
        username: generatedUsername,
        password: hashedPassword,
        avatar: req.body.avatar,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
export const signOut = async (req, res, next) => {
  const cookies = req.cookies?.access_token;
  if (!cookies) return next(errorHandler(401, "You are not logged in"));
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};
