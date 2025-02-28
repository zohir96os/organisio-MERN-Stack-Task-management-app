import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSun, FaMoon, FaRegMoon } from "react-icons/fa";

export default function Header({ toggleTheme, isDarkMode }) {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="flex  w-full z-99 justify-between items-center p-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="logo bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-white">
        <Link to="/">
          <h1 className="text-2xl font-bold uppercase">Organisio</h1>
        </Link>
      </div>
      <nav>
        <ul className="flex justify-between gap-4 uppercase text-teal-500 font-semibold">
          <li>
            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="rounded-full h-7 w-7 border border-teal-400"
                />
              </Link>
            ) : (
              <Link to="/signin">Sign in</Link>
            )}
          </li>
          <li>
            <button
              onClick={toggleTheme}
              className="relative focus:outline-none border rounded-full flex items-center h-7 w-14 p-1 justify-between cursor-pointer transition-all duration-300 ease-in-out "
              aria-label="Toggle theme"
            >
              <FaSun
                className={` ${
                  isDarkMode
                    ? "transform rotate-0 transition-all duration-500"
                    : "text-gray-300  transform rotate-180 transition-all duration-300 ease-in-out"
                }`}
              />
              {isDarkMode ? (
                <FaMoon className="text-gray-300 transition-all duration-300 ease-in-out" />
              ) : (
                <FaRegMoon className="transition-all duration-300 ease-in-out" />
              )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
