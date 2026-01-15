import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils";
import { ToastContainer } from "react-toastify";
const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/request-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.success === true) {
        handleSuccess(data.message);
      } else {
        handleError("Error requesting OTP.");
      }

      if (data.success === true) {
        setTimeout(() => {
          navigation("/reset_password");
        }, 2000);
      }
    } catch (error) {
      handleError("Error requesting OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-black bg-cover bg-no-repeat bg-[url('/mainpage_bg.jpg')]">
      <ToastContainer />
      <div className=" w-full h-svh flex justify-center items-center fixed bg-gradient-to-b from-[#000000cf] via-[#1c1c1c7f] to-[#000000cf] z-10"></div>
      <div className="  shadow-md  z-20 bg-[#000000a7] p-8 rounded-lg w-full max-w-md  mx-5">
        <h2 className="text-2xl font-semibold text-white mb-4">Request OTP</h2>
        <form onSubmit={handleRequestOTP}>
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full  ${
              !loading
                ? "hover:scale-105 bg-red-700"
                : "bg-red-500 cursor-not-allowed"
            }  duration-100 ease-in text-white font-bold py-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500`}
          >
            {loading ? "Sending..." : "Request OTP"}
          </button>
        </form>

        <div>
          <p className="text-gray-400 mt-4 text-right">
            <Link to="/login" className="text-red-700  hover:underline">
              Go Back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestReset;
