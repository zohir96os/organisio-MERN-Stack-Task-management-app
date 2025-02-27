import express from "express";
import {
  oauth,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/signin", signIn);
authRoutes.post("/oauth", oauth);
authRoutes.get("/signout", signOut);

export default authRoutes;
