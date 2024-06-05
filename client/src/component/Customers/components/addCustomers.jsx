/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CustomerNavigation from "../CustomerNavigation";
import { Modal, ModalBody, ModalFooter, Button } from 'flowbite-react';

function addCustomers() {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    customerType: "",
  });

  const [warehouseId, setWarehouseId] = useState("");

  // Tipe Pelanggan untuk logic tampilin tipe pelanggan di form
  const [customerTypes, setCustomerTypes] = useState([]);
  const [isNewType, setIsNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setWarehouseId(decoded.warehouse);
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
      fetchCustomerTypes(token);
    } else {
      console.log("Token tidak ada atau tidak valid!");
    }
  }, []);

  const fetchCustomerTypes = async (token) => {
    try {
      const response = await axios.get(
        "http://inventory-management-api.vercel.app/api/customers/customer-types",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCustomerTypes(response.data);
    } catch (error) {
      console.error("Error fetching customer types:", error);
      if (error.response && error.response.status === 401) {
        // console untuk apabila token tidak valid atau kadaluarsa
        console.log("Session expired. Please login again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zipCode"].includes(name)) {
      setCustomerData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setCustomerData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleConfirmAdd = () => {
    handleSubmit();
    setShowAddModal(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const token = Cookies.get("Token");
    if (!token) {
      console.error("Token tidak ada!");
      return;
    }

    const decoded = jwtDecode(token);
    const warehouseId = decoded.warehouse;

    let typeId = isNewType ? null : customerData.customerType; 

    if (isNewType && newTypeName.trim()) {
      try {
        const typeResponse = await axios.post(
          "http://inventory-management-api.vercel.app/api/customers/customer-types",
          { name: newTypeName, warehouse: warehouseId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setCustomerTypes((prev) => [...prev, typeResponse.data]);
        typeId = typeResponse.data._id; 
        setNewTypeName("");
        setIsNewType(false);
        setCustomerData((prevData) => ({
          ...prevData,
          customerType: typeId,
        }));

      } catch (error) {
        alert(
          "Gagal menambahkan tipe pelanggan baru, periksa data yang dimasukkan!",
        );
        console.error(
          "Error adding new customer type:",
          error.response?.data || error.message,
        );
        return;
      }
    }

    const finalCustomerData = {
      ...customerData,
      customerType: typeId || customerData.customerType, 
      warehouse: warehouseId,
    };

    // mengirim data terbaru dengan typeId
    try {
      await axios.post(
        "http://localhost:5000/api/customers",
        finalCustomerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      resetCustomerData();
      navigate("/customer");
    } catch (error) {
      alert("Gagal menambahkan pelanggan, periksa data yang dimasukkan!");
      console.error(
        "Add customer error:",
        error.response?.data || error.message,
      );
    }
  };


  const resetCustomerData = () => {
    setCustomerData({
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
      customerType: "",
    });
  };

  const handleTypeChange = (e) => {
    const selectedValue = e.target.value;
  setIsNewType(selectedValue === "new");
  if (selectedValue === "new") {
    setCustomerData(prevData => ({
      ...prevData,
      customerType: ''
    }));
  } else {
    // apabila tipe pelanggannya ada, maka cari namanya
    const typeName = customerTypes.find(type => type._id === selectedValue)?.name;
    setCustomerData(prevData => ({
      ...prevData,
      customerType: selectedValue,
      customerTypeName: typeName
    }));
  }
  };

  return (
    <>
      <CustomerNavigation />
      <div className="mt-4">
        <form
          onSubmit={(e) => { e.preventDefault(); setShowAddModal(true); }}
          className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl"
        >
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="md:col-span-1">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Tambah Pelanggan
              </h2>
            </div>
            <div className="md:col-span-1 text-right">
              <Link to={"/customer"}>
              <button
                className=" bg-white border-2 hover:bg-gray-100 text-black py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Batal
              </button>
              </Link>
            </div>
            <div className="md:col-span-1 form-group">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Pelanggan
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={customerData.name}
                onChange={handleChange}
                placeholder="Masukkan Nama Pelanggan"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-1 form-group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={customerData.email}
                onChange={handleChange}
                placeholder="Masukkan Email Pelanggan"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-1 form-group">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Nomor Handphone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={customerData.phone}
                onChange={handleChange}
                placeholder="Masukkan Nomor Handphone"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-1 form-group">
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700"
              >
                Alamat Penagihan
              </label>
              <input
                type="text"
                name="street"
                id="street"
                value={customerData.address.street}
                onChange={handleChange}
                placeholder="Masukkan Alamat Pelanggan"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-1 form-group">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                Kota
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={customerData.address.city}
                onChange={handleChange}
                placeholder="Masukkan Kota"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-1 form-group">
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                Provinsi
              </label>
              <input
                type="text"
                name="state"
                id="state"
                value={customerData.address.state}
                onChange={handleChange}
                placeholder="Masukkan Provinsi"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-1 form-group">
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700"
              >
                Kode Pos
              </label>
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                value={customerData.address.zipCode}
                onChange={handleChange}
                placeholder="Masukkan Kode Pos"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2 form-group">
              <label
                htmlFor="customerType"
                className="block text-sm font-medium text-gray-700"
              >
                Tipe Pelanggan
              </label>
              <select
                name="customerType"
                id="customerType"
                value={isNewType ? "new" : customerData.customerType}
                onChange={handleTypeChange}
                required={!isNewType}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>
                  {isNewType ? "Tipe baru..." : "Pilih Tipe Pelanggan"}
                </option>
                {customerTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
                <option value="new">+ Tambah Tipe Pelanggan Baru</option>
              </select>
              {isNewType && (
                <input
                  type="text"
                  placeholder="Nama Tipe Pelanggan Baru"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  required
                  className="mt-3 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              )}
            </div>
          </div>
          <div className="md:col-span-1 text-right mt-5">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Simpan
              </button>
            </div>
        </form>
      </div>
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <ModalBody>
          <p className="text-lg font-semibold text-center">Yakin ingin menambah Pelanggan?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowAddModal(false)}>Batal</Button>
          <Button color="success" onClick={handleConfirmAdd}>Iya</Button>
        </ModalFooter>
      </Modal>

    </>
  );
}

export default addCustomers;
