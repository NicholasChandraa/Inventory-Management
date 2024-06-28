/* eslint-disable */
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LogoPolytech from "../../assets/logo-web.png";
import { Button } from "flowbite-react";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Password tidak cocok");
      return;
    }

    try {
      await axios.post(
        `https://inventory-management-api.vercel.app/api/users/resetPassword/${token}`,
        { password },
      );
      setMessage("Password Anda telah berhasil direset. Silakan login.");
      setTimeout(() => navigate("/login"), 3000); // Redirect ke halaman login setelah beberapa detik
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mereset password.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 md:px-8 lg:px-0">
      <div className="w-full md:w-2/3 lg:w-1/3 mx-auto p-4 md:p-8 shadow-xl rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="font-bold text-center md:text-left">
            MANAGEMENT <br /> INVENTORY
          </h1>
          <img
            src={LogoPolytech}
            alt="Logo Polytech"
            className="inline-block w-24 md:w-32 mt-4 md:mt-0"
          />
        </div>

        <h1 className="text-center font-bold text-xl">Reset Password</h1>
        {message && <div className="text-center my-4">{message}</div>}
        {errorMessage && (
          <div className="text-center my-4 text-red-500">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col mt-4">
          <input
            type="password"
            placeholder="Password Baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-2 border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-2 border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Button color="blue" className="w-full mt-4" type="submit">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
