import MainButton from "./MainButton";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "../apps/user/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOauth = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/oauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  return (
    <MainButton
      type="button"
      inner={
        <span className="flex items-center gap-2 justify-center font-semibold ">
          <FcGoogle className="text-xl " /> Continue with Google
        </span>
      }
      className="bg-white w-md text-gray-700 border border-gray-300 shadow-md hover:bg-gray-100 transition-all"
      onClick={handleOauth}
    />
  );
}
