import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../apps/user/userSlice";
import MainButton from "../components/MainButton";
import OAuth from "../components/OAuth";
export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    dispatch(signInFailure(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInFailure(null));
    dispatch(signInStart());
    if (!formData.email || !formData.password) {
      dispatch(signInFailure("All fields are required!"));
      return;
    }
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="mx-auto w-lg p-3">
      <h1 className="text-center text-3xl font-bold uppercase text-slate-700">
        Sign in
      </h1>
      <form
        className="flex flex-col justify-center items-center p-3 gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
          className="border-2 border-teal-500 rounded-xl p-3 outline-none w-md"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          className="border-2 border-teal-500 rounded-xl p-3 outline-none w-md"
          onChange={handleChange}
        />
        <MainButton
          inner={loading ? "loading.." : "Sign in"}
          disabled={loading}
        />
        <OAuth />
        <p>
          Don&apos;t have an account?{" "}
          <Link className="text-blue-600" to="/signup">
            Sign up
          </Link>
        </p>
      </form>
      {error && <p className="text-rose-700">{error}</p>}
    </div>
  );
}
