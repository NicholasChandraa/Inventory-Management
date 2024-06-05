/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomerNavigation from "./CustomerNavigation";
import { jwtDecode } from "jwt-decode";
import { Modal, ModalBody, ModalFooter, Button } from 'flowbite-react';

function CustomerType() {
  const [customerTypes, setCustomerTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTypeId, setDeleteTypeId] = useState(null);

  useEffect(() => {
    fetchCustomerTypes();
  }, []);

  const fetchCustomerTypes = async () => {
    const token = Cookies.get("Token");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/customers/customer-types",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCustomerTypes(response.data);
    } catch (error) {
      console.error("Error dalam fetching data customer types", error);
    }
  };

  const handleAddCustomerType = async () => {
    const token = Cookies.get("Token");
    if (!token) {
      console.error("Token tidak ada");
      return;
    }

    const decode = jwtDecode(token);
    const warehouseId = decode.warehouse;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/customers/customer-types",
        { name: newType, warehouse: warehouseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCustomerTypes([...customerTypes, response.data]);
      setNewType("");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error menambahkan customers type", error);
    }
  };

  const handleConfirmDelete = async () => {
    deleteCustomerType(deleteTypeId);
    setShowDeleteModal(false);
  };

  const deleteCustomerType = async (typeId) => {
    const token = Cookies.get("Token");
    if (!token) {
      console.error("Token tidak ada!");
      return;
    }

    const decoded = jwtDecode(token);
    const warehouseId = decoded.warehouse;

    try {
      await axios.delete(
        `http://localhost:5000/api/customers/customer-types/${typeId}?warehouse=${warehouseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCustomerTypes((currentTypes) =>
        currentTypes.filter((type) => type._id !== typeId),
      );
    } catch (error) {
      console.error("Error deleting customer type:", error);
      alert("Gagal menghapus tipe pelanggan.");
    }
  };

  return (
    <>
      <CustomerNavigation />
      <div className="flex w-full items-start p-8">
        <div className="mr-5 bg-white rounded-lg shadow-lg w-1/2">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold mb-2">Tambah Tipe Pelanggan</h2>

            <button
              className="bg-[#67C23A] hover:bg-[#59B32D] active:bg-[#397B18] text-white py-2 px-4 rounded transition-colors font-medium"
              onClick={() => setShowAddModal(true)}
            >
              Tambah
            </button>
          </div>

          <hr className="border-t border-gray-400 w-full" />

          <div className="flex my-14 p-4">
            <div className="flex flex-col text-end mr-3">
              <label
                htmlFor="categoryName"
                className="block text-md font-bold text-gray-800 mb-1"
              >
                Nama Tipe Pelanggan:
              </label>

              <p className="text-sm text-gray-500">
                Tipe Pelanggan, untuk memudahkan pengguna dalam mencari informasi pelanggan
              </p>
            </div>
            <input
              id="categoryName"
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="Nama Tipe Pelanggan"
              className="p-2 border border-gray-300 rounded-lg mb-2"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg w-1/2">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-3">Tipe Pelanggan List</h2>
          </div>

          <hr className="border-t border-gray-400 w-full" />


          <div className="space-y-7 my-6 p-4">
            {customerTypes.map((type) => (
              <div
                key={type._id}
                className="flex justify-between items-center p-3 border-2 rounded-md font-semibold"
              >
                <div>{type.name}</div>
                <button
                  onClick={() => { setDeleteTypeId(type._id); setShowDeleteModal(true); }}
                  className="text-red-600 font-semibold text-lg hover:text-red-800 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <ModalBody>
          <p className="text-lg font-semibold text-center">Yakin ingin menambah Tipe Pelanggan?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowAddModal(false)}>Batal</Button>
          <Button color="success" onClick={handleAddCustomerType}>Iya</Button>
        </ModalFooter>
      </Modal>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalBody>
          <p className="text-lg font-semibold text-center">Yakin ingin menghapus Tipe Pelanggan? Semua Pelanggan yang memiliki tipe pelanggan ini akan terhapus!</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowDeleteModal(false)}>Batal</Button>
          <Button color="success" onClick={handleConfirmDelete}>Iya</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default CustomerType;
