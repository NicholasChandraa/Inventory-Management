/* eslint-disable */
import React, { useState } from "react";
import LogoPolytech from "../../assets/logo-web.png";
import { Link, Routes, Route } from "react-router-dom";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import LupaPassword from "./LupaPassword";
import { jwtDecode } from "jwt-decode";

function Login() {
  // HANDLE AUTENTIKASI
  let navigate = useNavigate();

  const [userRole, setUserRole] = useState("");
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [userId, setUserId] = useState(""); // State untuk menyimpan userId

  //state untuk error message
  const [errorMessage, setErrorMessage] = useState("");

  const handlerInput = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let { email, password } = input;

    axios
      .post("https://inventory-management-api.vercel.app/api/users/login", {
        email,
        password,
      })
      .then((res) => {
        let data = res.data;

        Cookies.set("Token", data.token, { expires: 1 }); // kadaluarsa dalam 1 hari
        const decodedToken = jwtDecode(data.token);

        setUserRole(decodedToken.role);

        navigate("/dashboard");
      })
      .catch((err) => {
        setErrorMessage("Email atau Password Salah!");
        // setTimeout(() => setErrorMessage(""), 10000);
      });
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-1/3 mx-auto p-8 shadow-xl rounded-md">
          <div className="bg-yellow-200 text-yellow-700 p-4 mb-4 border border-yellow-300 rounded">
            <p>
              Pemberitahuan: Fitur notifikasi dan foto profile di website ini saat ini tidak berfungsi karena Vercel tidak mendukung WebSocket.io dan file upload.
            </p>
          </div>
          <div className="flex justify-between items-center mb-10">
            <p className="inline-block font-bold">
              INVENTORY <br></br> MANAGEMENT
            </p>

            <img
              src={LogoPolytech}
              alt="Logo Polytech Indo Hausen"
              className="inline-block w-32"
            />
          </div>

          <div className="flex justify-center mt-4 font-bold text-xl">
            <h1>LOGIN</h1>
          </div>
          {/* Untuk menampilkan pesan error jika ada */}
          {errorMessage && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
              {errorMessage}
            </div>
          )}
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
                value={input.email}
                onChange={handlerInput}
                name="email"
                autoComplete="username"
                required
              />

              <label htmlFor="password" className="mt-4 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                placeholder="Password"
                value={input.password}
                onChange={handlerInput}
                name="password"
                autoComplete="current-password"
                required
              />
              <div className="flex justify-end mt-4 text-sky-600 font-medium">
                <Link to={"/LupaPassword"}>Lupa Password?</Link>
              </div>
              <Button color="blue" className="w-full mt-4" type="submit">
                Masuk
              </Button>
            </form>
          </div>
          <div className="flex justify-center mt-2 mb-20">
            <p>
              Belum punya akun?{" "}
              <Link to={"/Register"} className="text-sky-600 font-medium">
                {" "}
                Daftar disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
