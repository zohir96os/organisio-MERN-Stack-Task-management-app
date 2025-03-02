import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to db");
    app.listen(PORT, () => {
      console.log(`Server up on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error!";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
