import React, { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils";
import { ToastContainer } from "react-toastify";
function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pswd, setPswd] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      const data = await response.json();

      if (data.success) {
        handleSuccess(data.message);
        navigation("/login");
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-black bg-cover bg-no-repeat bg-[url('/mainpage_bg.jpg')]">
      <ToastContainer />
      <div className=" w-full h-svh flex justify-center items-center fixed bg-gradient-to-b from-[#000000cf] via-[#1c1c1c7f] to-[#000000cf] z-10"></div>
      <div className="  shadow-md  z-20 bg-[#000000a7] p-8 rounded-lg w-full max-w-md  mx-5">
        <h2 className="text-2xl font-semibold text-white mb-4">Verify OTP</h2>
        <form onSubmit={handleResetPassword}>
          <label htmlFor="email" className="block text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded mb-4 bg-[#39393938] outline outline-white text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="otp" className="block text-gray-400 mb-2">
            OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 rounded mb-4 bg-[#39393938] outline outline-white text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter OTP"
            required
          />
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <input
                type={pswd ? "password" : "text"}
                id="password"
                name="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full  p-3 rounded bg-[#39393938] outline outline-white text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Password"
                required
              />
              <div onClick={() => setPswd(!pswd)} className="cursor-pointer">
                {pswd ? (
                  <GoEyeClosed className="absolute top-1/4 right-3 text-white text-2xl" />
                ) : (
                  <GoEye className="absolute top-1/4 right-3 text-white text-2xl" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full  ${
              !loading
                ? "hover:scale-105 bg-red-700"
                : "bg-red-500 cursor-not-allowed"
            }  duration-100 ease-in text-white font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500`}
          >
            {loading ? "Verifying..." : "Reset Password"}
          </button>
        </form>

        <div>
          <p className="text-gray-400 mt-4 text-right">
            <Link to="/request_reset" className="text-red-700  hover:underline">
              Go Back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
