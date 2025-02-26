import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { RiHistoryFill } from "react-icons/ri";

import { FaEdit } from "react-icons/fa";
import Menu from "../components/Menu";
import { Link } from "react-router-dom";
import MainButton from "../components/MainButton";

export default function Tasks() {
  const { currentUser } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isCompleted: false,
  });

  useEffect(() => {
    getTasks();
  }, [currentUser]);

  const getTasks = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/get-tasks/${currentUser._id}`);
      const data = await res.json();
      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskId) return;
    try {
      setTaskId(taskId);
      const res = await fetch(`/api/delete-task/${taskId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setIsDeleteOpen(false);
      setTaskId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };
  const handleEdit = async (task) => {
    setTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
    });
    setIsUpdateOpen(true);
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    if (!taskId) return;
    try {
      const res = await fetch(`/api/update-task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? data.task : task))
      );
      setIsUpdateOpen(false);
      setTaskId(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center p-4 ">
      <h1 className="text-2xl uppercase">Tasks</h1>
      {Array.isArray(tasks) && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`group relative p-4 md:p-5 my-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${
                task.isCompleted
                  ? "bg-gradient-to-br from-green-50 to-green-100 border border-green-200/50"
                  : "bg-gradient-to-br from-white to-red-200 border border-red-200/50"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start min-w-xl gap-4">
                <div className="flex-1 relative">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${
                        task.isCompleted ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                      {task.title}
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-6 opacity-75 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setTaskId(task._id);
                      setIsDeleteOpen(true);
                    }}
                    className="cursor-pointer hover:scale-150 transition-all duration-200 ease-in-out"
                  >
                    <MdDelete className="text-red-400 text-3xl" />
                  </button>
                  <button
                    onClick={() => {
                      handleEdit(task);
                    }}
                    className="cursor-pointer hover:scale-150 transition-all duration-200 ease-in-out"
                  >
                    <FaEdit className="text-teal-400  text-3xl" />
                  </button>
                </div>
              </div>
              <div className="relative my-2 p-2 rounded-lg  overflow-hidden shadow-md w-full">
                <p>
                  <span className="text-md font-semibold">Created at</span>:{" "}
                  <span className="text-gray-500 text-xs ">
                    {new Date(task.createdAt).toLocaleString()}
                  </span>
                </p>
                <p>
                  <span className="text-md font-semibold">Last update</span>:{" "}
                  <span className="text-gray-500 text-xs ">
                    {new Date(task.updatedAt).toLocaleString()}
                  </span>
                </p>
                <div className="absolute top-5 right-9 text-7xl opacity-5 ">
                  <RiHistoryFill />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-700 rounded-lg shadow-2xl p-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <p className="text-center font-bold text-3xl p-3">
            You have no tasks yet!
          </p>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl">Start writing tasks now:</p>
            <Link to="/create-task" className="block">
              <IoCreateOutline className="text-5xl text-teal-300 hover:scale-110 transition-all ease-in-out" />
            </Link>
          </div>
        </div>
      )}
      <Menu />
      {isDeleteOpen && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center px-4 flex-wrap animate-fade-in">
          <div className="shadow-xl bg-white dark:bg-gray-900 rounded w-full max-w-md md:max-w-lg lg:max-w-xl transition-all">
            <div role="alert" aria-label="Confirm account deletion">
              <div className="bg-gradient-to-r from-red-400 to-rose-600 text-white font-bold rounded-t px-2 py-4 text-xl flex items-center gap-1">
                <MdDelete className="text-white text-2xl" />
                <h2 className="text-white text-center uppercase text-xl">
                  Delete task
                </h2>
              </div>
              <div className="border border-t-0 border-red-400 rounded-b p-3 text-slate-700 dark:text-gray-200">
                <p className="text-md">
                  Are you sur you want to delete this task ! This action cannot
                  be undonde.
                </p>
                <div className="flex justify-between items-center p-4">
                  <button
                    onClick={() => handleDeleteTask(taskId)}
                    className="cursor-pointer bg-red-400 text-white px-4 py-2 rounded-md hover:bg-rose-800 hover:shadow-rose-500/50 transition"
                  >
                    Yes
                  </button>
                  <button
                    className="cursor-pointer bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-800 transition"
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isUpdateOpen && (
        <div className=" backdrop-blur-md inset-0 absolute bg-black/50 flex justify-center items-center animate-fade-in ">
          <div className="shadow-xl bg-white dark:text-white mx-auto dark:bg-gradient-to-r from-slate-800 to-slate-900  rounded w-full rounded-t-lg max-w-md md:max-w-lg lg:max-w-xl transition-all">
            <div className="bg-gradient-to-r flex justify-center items-center gap-2 from-green-400 to-teal-600 w-full rounded-t-lg p-4">
              <FaEdit className="text-white text-xl" />
              <h2 className="text-white text-center uppercase text-xl">
                edit task
              </h2>
            </div>
            <form className="flex flex-col p-6 gap-4">
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                value={formData.title || ""}
                className="outline-none rounded-md w-full border-2 p-2 border-green-400"
                onChange={handleChange}
              />
              <textarea
                className="outline-none rounded-md w-full border-2 p-2 border-green-400"
                name="description"
                placeholder="Description"
                value={formData.description || ""}
                id="description"
                onChange={handleChange}
              ></textarea>
              <div>
                <span className="font-semibold text-xl text-green-400">
                  Completed:{" "}
                  <input
                    className="w-4 h-4 cursor-pointer"
                    type="checkbox"
                    name="isCompleted"
                    checked={formData.isCompleted || ""}
                    id="isCompleted"
                    onChange={handleChange}
                  />
                </span>
              </div>
            </form>
            <div className="flex items-center gap-4 p-2 justify-between">
              <MainButton
                inner={"Save"}
                type={"button"}
                className="bg-teal-400 text-white w-sm"
                onClick={() => handleUpdateTask(taskId, formData)}
              />
              <MainButton
                inner={"Cancel"}
                type={"button"}
                className="bg-rose-400 text-white w-sm"
                onClick={() => setIsUpdateOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
