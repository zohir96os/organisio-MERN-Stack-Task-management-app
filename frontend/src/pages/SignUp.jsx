import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainButton from "../components/MainButton";
import ErrorMessage from "../components/ErrorMessage";
export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mx-auto w-lg p-3">
      <h1 className="my-7 text-center text-2xl text-slate-900 uppercase dark:text-white ">
        Sign up
      </h1>
      <form
        className="flex flex-col justify-center items-center p-3 gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="username"
          id="username"
          placeholder="username"
          className="border-2 border-teal-500 rounded-xl p-3 outline-none w-md dark:text-white dark:border dark:border-teal-400 "
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
          className="border-2 border-teal-500 rounded-xl p-3 outline-none w-md dark:text-white dark:border dark:border-teal-400 "
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          className="border-2 border-teal-500 rounded-xl p-3 outline-none w-md dark:text-white dark:border dark:border-teal-400 "
          onChange={handleChange}
        />
        <MainButton
          inner={loading ? "loading.." : "Sign up"}
          disabled={loading}
          type="submit"
        />
        <p className="dark:text-white">
          Already have an account?{" "}
          <Link className="text-blue-600" to="/signin">
            Sign in
          </Link>
        </p>
      </form>
      <ErrorMessage message={error} />
    </div>
  );
}
