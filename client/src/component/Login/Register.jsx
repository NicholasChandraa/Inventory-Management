/* eslint-disable */
import React, { useState, useEffect } from "react";
import LogoPolytech from "../../assets/logo-web.png";
import { Link, Routes, Route } from "react-router-dom";
import { Button, Modal, Label, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  // HANDLE AUTENTIKASI
  let navigate = useNavigate();

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    warehouseId: "",
    password: "",
    // confirmPassword: "",
  });
  const [warehouses, setWarehouses] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchWarehouses = async () => {
      const result = await axios.get(
        "https://inventory-management-api.vercel.app/api/warehouses",
      );

      setWarehouses(result.data);
    };

    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    setDataUser({ ...dataUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://inventory-management-api.vercel.app/api/users/register",
        dataUser,
      );
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setIsError(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccess(false);
    navigate("/Login");
  };

  const handleCloseErrorModal = () => {
    setIsError(false);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4 md:px-8 lg:px-0">
        <div className="w-full md:w-2/3 lg:w-1/3 mx-auto p-4 md:p-8 shadow-xl rounded-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <p className="inline-block font-bold text-center md:text-left">
              INVENTORY <br></br> MANAGEMENT
            </p>
            <img
              src={LogoPolytech}
              alt="Logo Polytech Indo Hausen"
              className="inline-block w-24 md:w-32 mt-4 md:mt-0"
            />
          </div>

          <div className="flex justify-center mt-4 font-bold text-xl">
            <h1>DAFTAR</h1>
          </div>
          <div className="flex flex-col mt-4">
            <form onSubmit={handleSubmit}>
              <label htmlFor="name" className="">
                Nama
              </label>
              <input
                id="name"
                type="name"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                placeholder="Masukkan nama"
                name="name"
                onChange={handleChange}
                value={dataUser.name}
                required
              />

              <label htmlFor="email" className="mt-4 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                placeholder="email"
                name="email"
                onChange={handleChange}
                autoComplete="username"
                value={dataUser.email}
                required
              />

              <label htmlFor="warehouseId" className="mt-4 block">
                Pilih Warehouse:
              </label>

              <select
                name="warehouseId"
                id="warehouseId"
                value={dataUser.warehouseId}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                required
              >
                <option value="">Select Warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name} - {warehouse.location}
                  </option>
                ))}
              </select>

              <label htmlFor="password" className="mt-4 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                placeholder="password"
                name="password"
                onChange={handleChange}
                autoComplete="new-password"
                value={dataUser.password}
                required
              />

              <Button color="blue" className="w-full mt-7" type="submit">
                Daftar
              </Button>
            </form>
          </div>
          <div className="flex justify-center mt-2 mb-20">
            <p>
              Sudah punya akun?{" "}
              <Link to={"/Login"} className="text-sky-600 font-medium">
                {" "}
                Login disini
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Modal show={isSuccess} onClose={handleCloseSuccessModal}>
        <Modal.Header>Sukses</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Pendaftaran berhasil! Silakan login untuk melanjutkan.
            </h3>
            <Button color="green" onClick={handleCloseSuccessModal}>
              Oke
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={isError} onClose={handleCloseErrorModal}>
        <Modal.Header>Error</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {errorMessage}
            </h3>
            <Button color="red" onClick={handleCloseErrorModal}>
              Oke
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Register;
