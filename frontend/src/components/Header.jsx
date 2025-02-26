import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
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
                  className="rounded-full h-7 w-7  border-1 border-teal-400"
                />
              </Link>
            ) : (
              <Link to="/signin">Sign in</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
