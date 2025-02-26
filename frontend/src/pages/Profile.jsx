import { useSelector } from "react-redux";
import MainButton from "../components/MainButton";
import { IoWarning } from "react-icons/io5";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  signOutStart,
  signInFailure,
  signOutSuccess,
  deleteAccountStart,
  deleteAccountSuccess,
  deleteAccountFailure,
} from "../apps/user/userSlice";
import Menu from "../components/Menu";
import SuccessMessage from "../components/SuccessMessage";
export default function Profile() {
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username || "",
    email: currentUser.email || "",
    password: "",
  });

  useEffect(() => {
    if (error) {
      dispatch(updateProfileFailure(null));
    }
  }, [formData, dispatch]);

  const handleChange = async (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateProfileStart());
    const updatedUsername = formData.username.trim();
    const updatedEmail = formData.email.trim();
    const updatedPassword = formData.password;

    const isFormModified =
      (updatedUsername && updatedUsername !== currentUser.username) ||
      (updatedEmail && updatedEmail !== currentUser.email) ||
      (updatedPassword && updatedPassword.length > 0);

    if (!isFormModified) {
      dispatch(updateProfileFailure("No changes detected"));
      return;
    }
    const updatedData = {
      username: updatedUsername,
      email: updatedEmail,
    };
    if (updatedPassword) {
      updatedData.password = updatedPassword;
    }
    try {
      const res = await fetch(`/api/update-profile/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateProfileFailure(data.message));
        return;
      }
      setSuccess("Profile updated successfully");
      dispatch(updateProfileSuccess(data));
    } catch (error) {
      dispatch(updateProfileFailure(error));
    }
  };
  const handleSignOut = async () => {
    dispatch(signOutStart());
    try {
      const res = await fetch("/api/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
      navigate("/signin");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  const handleDeleteDialogue = () => {
    setIsOpen(true);
  };
  const handleDeleteAccount = async () => {
    dispatch(deleteAccountStart());
    try {
      const res = await fetch(`/api/delete-account/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteAccountFailure(data.message));
        setIsOpen(false);
      }
      dispatch(deleteAccountSuccess(data));
      setIsOpen(false);
      navigate("/signin");
    } catch (error) {
      dispatch(deleteAccountFailure(error));
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl text-slate-900 uppercase my-10">
        Profile
      </h1>
      <form className="flex flex-col gap-2 shadow-lg p-4 rounded-md">
        <input type="file" name="avatar" id="avatar" hidden />
        <img
          src={currentUser.avatar}
          alt="profile"
          className="w-24 h-24 rounded-full border-1 border-teal-400 cursor-pointer self-center"
        />
        <input
          type="text"
          name="username"
          id="username"
          placeholder="username"
          value={formData.username}
          className="shadow-lg my-5 rounded-xl p-2 outline-none "
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
          value={formData.email}
          className="shadow-lg my-5 rounded-xl p-2 outline-none "
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          placeholder="password"
          className="shadow-lg my-5 rounded-xl p-2 outline-none "
          onChange={handleChange}
        />
        <MainButton
          inner={loading ? "Loading.." : "Update"}
          onClick={handleUpdate}
        />
        {error && <p className="text-rose-700">{error}</p>}
        <SuccessMessage message={success} />
        <div className="flex justify-between items-center mt-5">
          <span
            className="text-rose-600 font-semibold cursor-pointer"
            onClick={handleDeleteDialogue}
          >
            Delete account
          </span>
          <span
            className="text-sky-600 font-semibold cursor-pointer"
            onClick={handleSignOut}
          >
            Sign out
          </span>
        </div>
      </form>
      {isOpen && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center px-4 flex-wrap animate-fade-in">
          <div className="shadow-xl bg-white dark:bg-gray-900 rounded w-full max-w-md md:max-w-lg lg:max-w-xl transition-all">
            <div role="alert" aria-label="Confirm account deletion">
              <div className="bg-gradient-to-r from-red-400 to-rose-600 text-white font-bold rounded-t px-2 py-4 text-xl flex items-center gap-1">
                <IoWarning className="text-white" />
                <span>Are you sure you want to delete your account?</span>
              </div>
              <div className="border border-t-0 border-red-400 rounded-b p-3 text-slate-700 dark:text-gray-200">
                <p className="text-md">
                  We’re sad to see you go! All your tasks will be permanently
                  deleted.
                </p>
                <div className="flex justify-between items-center p-4">
                  <button
                    className="cursor-pointer bg-red-400 text-white px-4 py-2 rounded-md hover:bg-rose-800 hover:shadow-rose-500/50 transition"
                    onClick={handleDeleteAccount}
                  >
                    Yes
                  </button>
                  <button
                    className="cursor-pointer bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-800 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Menu />
    </div>
  );
}
