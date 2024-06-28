/* eslint-disable */

import React, { useState, useEffect } from "react";
import CustomerNavigation from "./CustomerNavigation";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Modal, ModalBody, ModalFooter, Button } from "flowbite-react";

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [customerTypes, setCustomerTypes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("Token");
    if (!token) {
      console.log("Token Tidak Ada!");
    }

    const decoded = jwtDecode(token);
    const warehouseId = decoded.warehouse;

    const fetchData = async () => {
      await fetchCustomers(warehouseId, token);
      await fetchCustomerTypes(token);
    };

    fetchData();
  }, [nameFilter, typeFilter, dateFilter]);

  async function fetchCustomers(warehouseId, token) {
    try {
      const result = await axios.get(
        "https://inventory-management-api.vercel.app/api/customers/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { warehouse: warehouseId },
        },
      );
      setCustomers(result.data);

      const filtered = result.data.filter((customer) => {
        return (
          customer.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
          (customer.customerType?.name
            ?.toLowerCase()
            .includes(typeFilter.toLowerCase()) ||
            false) &&
          (!dateFilter ||
            new Date(customer.createdAt).toDateString() ===
              new Date(dateFilter).toDateString())
        );
      });

      setFilteredCustomers(filtered);
    } catch (error) {
      console.error("Error fetch customer: ", error);
    }
  }

  async function fetchCustomerTypes(token) {
    try {
      const result = await axios.get(
        "https://inventory-management-api.vercel.app/api/customers/customer-types",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCustomerTypes(result.data);
    } catch (error) {
      console.error("Error fetch customer types:", error);
      console.log(error.response.data);
    }
  }

  function handleFilterChange(e, type) {
    const value = e.target.value;

    if (type === "name") {
      setNameFilter(value);
    } else if (type === "type") {
      setTypeFilter(value);
    } else if (type === "date") {
      setDateFilter(value);
    }
  }

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const formatId = (id) => {
    return `IDP-${id.slice(-8)}`;
  };

  // Mengambil data untuk total pelanggan
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        (customer.customerType?.name
          ?.toLowerCase()
          .includes(typeFilter.toLowerCase()) ||
          false) &&
        (!dateFilter ||
          new Date(customer.createdAt).toLocaleDateString() ===
            new Date(dateFilter).toLocaleDateString())
      );
    });

    setFilteredCustomers(filtered);
  }, [nameFilter, typeFilter, dateFilter, customers]);

  const handleCustomerClick = (customerId) => {
    navigate(`/customer/customerPage/detailCustomer/${customerId}`);
  };

  const handleDeleteCustomer = async () => {
    const token = Cookies.get("Token");
    if (!token) return;

    try {
      await axios.delete(
        `https://inventory-management-api.vercel.app/api/customers/${customerIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCustomers(
        customers.filter((customer) => customer._id !== customerIdToDelete),
      );
      setShowDeleteModal(false);
      setCustomerIdToDelete(null);
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleConfirmDelete = (customerId) => {
    setCustomerIdToDelete(customerId);
    setShowDeleteModal(true);
  };

  return (
    <>
      <CustomerNavigation />
      <div className="p-6 min-h-screen">
        <div className="flex flex-wrap gap-6 mb-8 bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            className="flex-grow min-w-[240px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Filter berdasarkan nama..."
            value={nameFilter}
            onChange={(e) => handleFilterChange(e, "name")}
          />
          <select
            className="flex-grow min-w-[200px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => handleFilterChange(e, "type")}
            value={typeFilter}
          >
            <option value="">Semua Tipe</option>
            {customerTypes.map((type) => (
              <option key={type._id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="flex-grow min-w-[200px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={dateFilter}
            onChange={(e) => handleFilterChange(e, "date")}
          />
          <Link
            to={"/customer/customerPage/addCustomers/"}
            className="flex justify-center"
          >
            <button className="bg-[#67C23A] hover:bg-[#59B32D] active:bg-[#397B18] text-white py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
              Tambah
            </button>
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full">
            <thead className="text-white bg-black">
              <tr>
                <th className="px-5 py-3 bg-gray-800 text-start text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-md">
                  Nama
                </th>
                <th className="px-5 py-3 bg-gray-800 text-start text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  ID Pelanggan
                </th>
                <th className="px-5 py-3 bg-gray-800 text-start text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 bg-gray-800 text-start text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Telepon
                </th>
                <th className="px-5 py-3 bg-gray-800 text-start text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-5 py-3 bg-gray-800 text-start text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Tanggal Daftar
                </th>
                <th className="px-5 py-3 bg-gray-800 text-start text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Hapus
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  className="hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleCustomerClick(customer._id)}
                      className="text-blue-500 hover:text-blue-700 text-start"
                    >
                      {customer.name}
                    </button>
                  </td>
                  <td className="px-6 py-4">{formatId(customer._id)}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">
                    {customer.customerType
                      ? customer.customerType.name
                      : "Tipe Customer Tidak Ditemukan"}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-start">
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleConfirmDelete(customer._id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="shadow w-fit rounded-lg">
          <p className="mt-5 p-3 font-medium text-gray-900">
            Total Pelanggan: {filteredCustomers.length}
          </p>
        </div>
      </div>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalBody>
          <p className="text-lg font-semibold text-center">
            Yakin ingin menghapus data Pelanggan?
          </p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button color="success" onClick={handleDeleteCustomer}>
            Iya
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default CustomerPage;
