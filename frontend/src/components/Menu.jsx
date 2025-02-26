import { useState } from "react";
import { MdPlaylistAdd, MdPlaylistAddCheck, MdMoreVert } from "react-icons/md";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        />
      )}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 backdrop:backdrop-blur-2xl">
        {isOpen && (
          <div className="flex  flex-col gap-2">
            <button className="cursor-pointer flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-slate-800 to-slate-900  text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-in-out">
              <Link to="/create-task">
                <MdPlaylistAdd
                  className=" text-4xl rounded-full"
                  title="Create Task"
                />
              </Link>
            </button>
            <button className="cursor-pointer flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-slate-800 to-slate-900  text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-in-out">
              <Link to={`/get-tasks/${currentUser._id}`}>
                <MdPlaylistAddCheck
                  className=" text-4xl rounded-full"
                  title="View Tasks"
                />
              </Link>
            </button>
            <Link to="/profile">
              <img
                title="Profile"
                src={currentUser.avatar}
                alt="profile"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-in-out border-1 border-slate-800"
              />
            </Link>
          </div>
        )}
        <button
          onClick={toggleMenu}
          className="cursor-pointer mt-4 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-in-out"
        >
          {isOpen ? (
            <MdMoreVert className=" text-4xl rounded-full transition-transform duration-300 ease-in-out" />
          ) : (
            <MdMoreVert className=" text-4xl rounded-full rotate-90 transition-transform duration-300 ease-in-out" />
          )}
        </button>
      </div>
    </>
  );
}
