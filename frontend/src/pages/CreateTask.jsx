import { useState } from "react";
import MainButton from "../components/MainButton";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { useSelector } from "react-redux";
import Menu from "../components/Menu";

export default function CreateTask() {
  const { currentUser } = useSelector((state) => state.user);
  const [isChecked, setIsChecked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isCompleted: false,
  });
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (type === "checkbox") {
      setIsChecked(checked);
    }
  };
  const handleTaskCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/create-task/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        setError(data.message);
      }
      setSuccess("Task created successfully!");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      <div className="flex justify-center flex-col items-center p-3">
        <h1 className="text-2xl font-bold text-slate-900 uppercase">
          Create Task
        </h1>
        <form
          onSubmit={handleTaskCreate}
          className="flex flex-col gap-2 shadow-lg p-4 rounded-md"
        >
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            className="shadow-lg my-5 rounded-xl p-2 outline-none "
            onChange={handleChange}
          />
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            className="shadow-lg my-5 rounded-xl p-2 outline-none"
            onChange={handleChange}
          />
          <label className="flex items-center gap-2 my-5 cursor-pointer">
            <span className="text-xl">Completed:</span>
            <input
              type="checkbox"
              checked={isChecked}
              id="isCompleted"
              className="hidden peer"
              onChange={handleChange}
            />
            <div className="w-6 h-6 text-3xl text-gray-400 rounded-md flex items-center justify-center peer-checked:text-blue-500">
              {isChecked ? (
                <MdOutlineCheckBox className="text-blue-500" />
              ) : (
                <MdOutlineCheckBoxOutlineBlank />
              )}
            </div>
          </label>
          <MainButton
            inner={"create"}
            type={"button"}
            className="bg-gradient-to-r from-slate-800 to-slate-900 w-md text-white"
          />
          {error && <p className="text-rose-700">{error}</p>}
          {success && (
            <p className="text-teal-700">Profile updated successfully!</p>
          )}
        </form>
      </div>
      <Menu />
    </>
  );
}
