import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-linear-to-r from-slate-900 via-sky-500 to-indigo-800">
      <div className="logo bg-linear-to-tr from-teal-800 via-sky-500 to-emerald-900 bg-clip-text text-transparent">
        <Link to="/">
          <h1 className="text-2xl font-bold uppercase text-">Organisio</h1>
        </Link>
      </div>
      <nav>
        <ul className="flex justify-between gap-4 uppercase text-teal-500 font-semibold">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/signin">Sign in</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
