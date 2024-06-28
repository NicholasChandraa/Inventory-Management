/* eslint-disable */
import React, { useState } from "react";
import LogoPolytech from "../../assets/logo-web.png";
import { Link, Routes, Route } from "react-router-dom";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LupaPassword() {
  // HANDLE AUTENTIKASI
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://inventory-management-api.vercel.app/api/users/forgotPassword",
        { email },
      );
      if (response.data) {
        setMessage(
          "Instruksi reset password telah dikirim ke email Anda.",
          response.data.message,
        );
        setEmail("");
      }
    } catch (error) {
      setErrorMessage(
        `Terjadi kesalahan, silakan coba lagi. Error: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4 md:px-8 lg:px-0">
        <div className="w-full md:w-2/3 lg:w-1/3 mx-auto p-4 md:p-8 shadow-xl rounded-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h1 className="font-bold text-center md:text-left">
              INVENTORY <br />
              MANAGEMENT{" "}
            </h1>
            <img
              src={LogoPolytech}
              alt="Logo Polytech Indo Hausen"
              className="inline-block w-24 md:w-32 mt-4 md:mt-0"
            />
          </div>

          <div className="flex justify-center mt-4 font-bold text-xl">
            <h1>Lupa Password</h1>
          </div>
          <div>
            {message && <div className="text-center my-4">{message}</div>}
            {errorMessage && (
              <div className="text-center my-4 text-rose-500">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="flex flex-col mt-4">
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" className="">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                name="email"
                required
              />

              <div className="flex justify-end mt-4 text-sky-600 font-medium"></div>
              <Button color="blue" className="w-full mt-4" type="submit">
                Kirim Email Reset Password
              </Button>
            </form>
          </div>
          <div className="flex justify-center mt-5 text-neutral-500 font-sm">
            <p>
              Cek kotak spam jika Anda tidak menerima email untuk reset password
              di kotak masuk.
            </p>
          </div>
          <div className="mb-20 mt-10 text-center text-sky-600">
            <Link to={"/Login"}>Kembali ke halaman log in</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LupaPassword;
