import express from "express";
import {
  deleteAccount,
  updateProfile,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRoutes = express.Router();

userRoutes.put("/update-profile/:id", verifyToken, updateProfile);
userRoutes.delete("/delete-account/:id", verifyToken, deleteAccount);

export default userRoutes;
