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
        { password }
      );
      setMessage("Password Anda telah berhasil direset. Silakan login.");
      setTimeout(() => navigate('/login'), 3000); // Redirect ke halaman login setelah beberapa detik
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Terjadi kesalahan saat mereset password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-1/3 mx-auto p-8 shadow-xl rounded-md">
        <div className="flex justify-between">
          <h1 className="font-bold">MANAGEMENT <br /> INVENTORY</h1>
          <img src={LogoPolytech} alt="Logo Polytech" className="w-32" />
        </div>

        <h1 className="text-center font-bold text-xl">Reset Password</h1>
        {message && <div className="text-center my-4">{message}</div>}
        {errorMessage && <div className="text-center my-4 text-red-500">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col mt-4">
          <input
            type="password"
            placeholder="Password Baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-2 border border-gray-300 p-2"
          />
          <input
            type="password"
            placeholder="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-2 border border-gray-300 p-2"
          />
          <Button color="blue" className="mt-4" type="submit">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
