import Task from "../models/task.model.js";
import { errorHandler } from "../utils/error.js";

export const createTask = async (req, res, next) => {
  const userId = req.user.id;
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized!"));
  const { title, description, isCompleted } = req.body;
  if (!title || !description || typeof isCompleted !== "boolean") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const task = await Task.create({
      title,
      description,
      isCompleted,
      user: userId,
    });
    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const user = req.params.id;
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can only see your own tasks"));
    const tasks = await Task.find({ user }).sort({
      createdAt: -1,
      updupdatedAt: -1,
    });
    if (tasks.length === 0) return next(errorHandler(404, "No tasks found"));
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(errorHandler(404, "No task found!"));
  if (task.user.toString() !== req.user.id) {
    return next(errorHandler(403, "You can only delete your own tasks"));
  }
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json("Task deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  const { title, description, isCompleted } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) return next(errorHandler(404, "Task not found"));
  if (task.user.toString() !== req.user.id) {
    return next(errorHandler(403, "You can only update your own tasks"));
  }
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        isCompleted,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({ task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const searchTasks = async (req, res, next) => {
  try {
    const searchTerm = req.query.query || ""; // Default to empty string if not provided
    const completedFilter = req.query.completedFilter; // 'true', 'false', or 'all'

    // Base query: only tasks for the authenticated user
    let query = { user: req.user.id };

    // Add search term filter if provided
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search in title
        { description: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search in description
      ];
    }

    // Add completion status filter if provided
    if (completedFilter === "true") {
      query.isCompleted = true;
    } else if (completedFilter === "false") {
      query.isCompleted = false;
    }
    // If completedFilter is 'all' or undefined, no completion filter is applied

    // Fetch tasks, sorted by creation date (newest first)
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks); // Return tasks (empty array if none found)
  } catch (error) {
    next(error); // Pass errors to error-handling middleware
  }
};
