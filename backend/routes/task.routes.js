import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createTask,
  deleteTask,
  getTasks,
  searchTasks,
  updateTask,
} from "../controllers/task.controller.js";

const taskRoutes = express.Router();

taskRoutes.post("/create-task/:id", verifyToken, createTask);
taskRoutes.get("/get-tasks/:id", verifyToken, getTasks);
taskRoutes.delete("/delete-task/:id", verifyToken, deleteTask);
taskRoutes.put("/update-task/:id", verifyToken, updateTask);
taskRoutes.get("/search-tasks", verifyToken, searchTasks);

export default taskRoutes;
