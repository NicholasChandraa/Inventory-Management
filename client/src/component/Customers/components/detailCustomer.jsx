/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, Button } from 'flowbite-react';

function detailCustomer() {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableCustomer, setEditableCustomer] = useState({});

  const [newType, setNewType] = useState("");
  const [isCreatingNewType, setIsCreatingNewType] = useState(false);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerDetails();
    fetchCustomerTypes();
  }, [customerId]);

  useEffect(() => {
    if (customer && customerTypes.length > 0) {
      const customerTypeId = getCustomerTypeId(customer.customerType);
      setEditableCustomer((prev) => ({
        ...prev,
        customerType: customerTypeId,
      }));
    }
  }, [customer, customerTypes]);

  const fetchCustomerDetails = async () => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.get(
        `https://inventory-management-api.vercel.app/api/customers/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data) {
        setCustomer(response.data);
        setEditableCustomer({
          ...response.data,
          customerType:
            response.data.customerType?._id || response.data.customerType || "",
        });

      } else {
        console.error("Customer data not found in the response");
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const getCustomerTypeId = (customerTypeName) => {
    const customerType = customerTypes.find((type) => type.name === customerTypeName);
    return customerType ? customerType._id : "Tidak ada id tipe pelanggan!";
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressKey = name.split(".")[1];
      setEditableCustomer((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressKey]: value,
        },
      }));
    } else {
      setEditableCustomer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchCustomerTypes = async () => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.get(
        "https://inventory-management-api.vercel.app/api/customers/customer-types",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCustomerTypes(response.data);
    } catch (error) {
      console.error("Error fetching customer types:", error);
    }
  };

  const handleTypeSelection = (e) => {
    const selectedType = e.target.value;
    console.log(selectedType)
    if (selectedType === "newType") {
      setIsCreatingNewType(true);
    } else {
      setIsCreatingNewType(false);
      setEditableCustomer((prev) => ({
        ...prev,
        customerType: selectedType,
      }));
    }
  };

  const handleNewTypeChange = (e) => {
    setNewType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => { 
    const token = Cookies.get("Token");
    let updateData = { ...editableCustomer };
    if (isCreatingNewType && newType) {
      updateData = { ...updateData, newCustomerType: newType };
    }

    if (!updateData.customerType || updateData.customerType === "") {
      console.error("Customer type is invalid");
      return;
    }

    console.log("Sending update request with data:", updateData);

    try {
      const response = await axios.put(
        `https://inventory-management-api.vercel.app/api/customers/${customerId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        await fetchCustomerDetails();
        setIsCreatingNewType(false);
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating customer:", error.response ? error.response.data : error.message);
    }
    setShowConfirmationModal(false);
  };


  if (!customer) return <div>Loading...</div>;

  return (
    <div className="container w-2/5 mx-auto my-8 pt-4 pb-10 px-8 bg-white rounded-lg shadow-lg max-w-2xl">
      <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 mb-10">
              Pelanggan Detail
            </h2>
            <div className="border-b-2"></div>
      {!isEditing ? (
          <div className="">
            <div className="mt-8 space-y-6">
              <div className="text-sm font-medium text-gray-600 flex justify-between border p-3 rounded-md border p-3 rounded-md">
                <span>Nama </span> <span className="text-gray-900">{customer.name}</span>
              </div>
              <div className="text-sm font-medium text-gray-600 flex justify-between border p-3 rounded-md">
                <span>Email </span> <span className="text-gray-900">{customer.email}</span>
              </div>
              <div className="text-sm font-medium text-gray-600 flex justify-between border p-3 rounded-md">
                <span>No Handphone </span> <span className="text-gray-900">{customer.phone}</span>
              </div>
              <div className="text-sm font-medium text-gray-600 flex justify-between border p-3 rounded-md">
                <span>Tipe Pelanggan </span> <span className="text-gray-900">{customer.customerType || customer.customerType.name}</span>
              </div>
              <div className="text-sm font-medium text-gray-600 flex justify-between border p-3 rounded-md">
                <span>Gudang </span> <span className="text-gray-900">{customer.warehouse && customer.warehouse.name}</span>
              </div>
              <div className="text-sm font-medium text-gray-600 flex flex-col border p-3 rounded-md">
                <span>Alamat </span> <span className="text-gray-900 mt-2">{`${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zipCode}`}</span>
              </div>
              <div className="text-sm font-medium text-gray-600 flex justify-between border p-3 rounded-md">
                <span>Dibuat Pada </span> <span className="text-gray-900">{new Date(customer.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={toggleEdit}
              className="group relative w-full mt-8 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-6">
              Nama:
            </label>
            <input
              type="text"
              name="name"
              value={editableCustomer.name || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-6">
              Email:
            </label>
            <input
              type="text"
              name="email"
              value={editableCustomer.email || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-6">
              No Handphone:
            </label>
            <input
              type="text"
              name="phone"
              value={editableCustomer.phone || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-6">
              Tipe Pelanggan:
            </label>
            <select
              value={editableCustomer.customerType || ""}
              onChange={handleTypeSelection}
              className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {customerTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
              <option value="newType">Buat Tipe Baru</option>
            </select>
            {isCreatingNewType && (
              <input
                type="text"
                placeholder="Masukkan tipe pelanggan baru"
                value={newType}
                onChange={handleNewTypeChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <label className="block text-sm font-medium text-gray-700 mt-6">Gudang:</label>
            <input type="text" value={customer.warehouse?.name} className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" disabled />

            <label className="block text-sm font-medium text-gray-700 mt-6">
              Nama Jalan:
            </label>
            <input
              type="text"
              name="address.street"
              value={editableCustomer.address.street || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-6">
              Kota:
            </label>
            <input
              type="text"
              name="address.city"
              value={editableCustomer.address.city || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-6">
              Provinsi:
            </label>
            <input
              type="text"
              name="address.state"
              value={editableCustomer.address.state || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-6">
              Kode Pos:
            </label>
            <input
              type="text"
              name="address.zipCode"
              value={editableCustomer.address.zipCode || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-start space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
            >
              Simpan
            </button>
            <button
              onClick={toggleEdit}
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-300"
            >
              Batal
            </button>
          </div>
        </form>
      )}
      <div className="mt-5">
      <Link to={'/customer'} className="text-blue-600 font-medium text-lg">
        Kembali ke Daftar Halaman
      </Link>
      </div>

      <Modal show={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}>
        <ModalBody>
          <p className="text-lg font-semibold text-center">Yakin ingin mengedit atau mengubah data pelanggan?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowConfirmationModal(false)}>Batal</Button>
          <Button color="success" onClick={handleConfirmSubmit}>Iya</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default detailCustomer;
