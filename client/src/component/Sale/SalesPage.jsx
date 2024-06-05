/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SalesNavigation from "./SalesNavigation";
import { useNavigate } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, Button } from 'flowbite-react'; 

function SalesPage() {
  const [sales, setSales] = useState([]);
  const [editSaleId, setEditSaleId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showEditConfirmationModal, setShowEditConfirmationModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.get("http://localhost:5000/api/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredSales = response.data.filter((sale) =>
        sale.items.some((item) => item.product && item.product._id),
      );

      setSales(filteredSales);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
    }
  };

  const handleStatus = async (e, saleId) => {
    const token = Cookies.get("Token");

    const statusValue = e.target.value;
    const statusName = e.target.name;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/sales/${saleId}`,
        { [statusName]: statusValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSales((prevSales) =>
        prevSales.map((saleItem) => {
          if (saleItem._id === saleId) {
            return { ...saleItem, [statusName]: statusValue };
          }
          return saleItem;
        }),
      );

      console.log(response);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Failed to change status:", error.response.data);
        alert(`Failed to change status: ${error.response.data.message}`);
      } else {
        console.error("Failed to change status:", error);
        alert("Failed to change status. Please try again later.");
      }
    }
  };

  const handleOrderClick = (saleId) => {
    navigate(`/sales/salesPage/saleDetail/${saleId}`);
  };

  const startEditing = (sale) => {
    setEditSaleId(sale._id);
    setEditedValues({ paymentReceived: sale.paymentReceived });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedValues({ ...editedValues, [name]: value });
  };

  const confirmEdit = (saleId) => {
    setSelectedSaleId(saleId); 
    setShowEditConfirmationModal(true);
  };

  const handleSave = async () => {
    const token = Cookies.get("Token");
    const saleId = selectedSaleId;
    const editedSale = sales.find((sale) => sale._id === saleId);

    if (!editedSale) {
      console.error("Sale untuk di edit tidak ketemu!");
      return;
    }

    const remainingAmount =
      editedSale.totalAmount - editedValues.paymentReceived;

    try {
      const payload = {
        ...editedValues,
        remainingAmount,
      };

      await axios.put(`http://localhost:5000/api/sales/${saleId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSales(
        sales.map((sale) =>
          sale._id === saleId ? { ...sale, ...payload } : sale,
        ),
      );
      setEditSaleId(null);
      fetchSales();
      setShowEditConfirmationModal(false);
    } catch (error) {
      console.error(
        "Error updating sale: ",
        error.response ? error.response.data : error,
      );
      alert(
        `Error updating sale: ${error.response ? error.response.data.message : "Server error"}`,
      );
    }
  };

  const cancelEdit = () => {
    setEditSaleId(null);
  };

  const updateSale = async (id) => {
    navigate(`sales/salesPage/saleDetail/${id}`);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmationModal(false);
    if (selectedSaleId) {
      deleteSale(selectedSaleId);
    }
  };

  const deleteSale = async (saleId) => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/sales/${saleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // If successful, refresh the sales list
      fetchSales();
      console.log("Sale deleted successfully", response.data);
    } catch (error) {
      console.error(
        "Error deleting sale:",
        error.response ? error.response.data : error,
      );
    }
  };

  const openConfirmationModal = (saleId) => {
    setSelectedSaleId(saleId);
    setShowConfirmationModal(true);
  };

  return (
    <>
      <SalesNavigation />
      <div className="p-8 pt-10">
        <h2 className="text-2xl font-medium">DAFTAR PENJUALAN</h2>
        <div className="border-b-2 my-6 mb-8"></div>
        <table className="mt-5 text-sm">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-md">No. Pesanan</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Tanggal Jual</th>
              <th className="px-2 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Pelanggan</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Alamat</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Total</th>
              <th className="px-3 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Pembayaran Diterima
              </th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Edit Pembayaran</th>
              <th className="px-2 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Sisa Pembayaran</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status Pembayaran</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status Pengiriman</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-lg">Hapus</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td
                  className="text-start py-2 px-3 border cursor-pointer text-blue-500 hover:text-blue-800"
                  onClick={() => handleOrderClick(sale._id)}
                >
                  {sale.orderNumber}
                </td>
                <td className="text-start py-2 px-3 border">
                  {new Date(sale.saleDate).toLocaleDateString()}
                </td>
                <td className="text-start py-2 px-3 border">
                  {sale.customer.name}
                </td>
                <td className="text-start py-2 px-3 border">
                  {sale.customer.address.street}, {sale.customer.address.city},{" "}
                  {sale.customer.address.state}, {sale.customer.address.zipCode}
                </td>
                <td className="text-start py-2 px-3 border">
                  {sale.totalAmount.toLocaleString()}
                </td>
                <td className="text-start py-2 px-3 border">
                  {editSaleId === sale._id ? (
                    <input
                      type="number"
                      name="paymentReceived"
                      value={editedValues.paymentReceived}
                      onChange={handleEditChange}
                    />
                  ) : (
                    sale.paymentReceived.toLocaleString()
                  )}
                </td>
                <td className="py-2 px-3 border">
                  {editSaleId === sale._id ? (
                    <button
                      onClick={() => confirmEdit(sale._id)}
                      className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg text-white font-medium w-full mb-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(sale)}
                      className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded-lg text-white font-medium w-full"
                    >
                      Edit
                    </button>
                  )}
                  {editSaleId === sale._id && (
                    <button
                      onClick={cancelEdit}
                      className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded-lg text-white font-medium w-full"
                    >
                      Cancel
                    </button>
                  )}
                </td>
                <td className="text-start py-2 px-3 border">
                  {sale.remainingAmount.toLocaleString()}
                </td>
                <td className="text-start py-2 px-3 border">
                  <select
                    name="paymentStatus"
                    value={sale.paymentStatus}
                    onChange={(e) => handleStatus(e, sale._id)}
                  >
                    <option value="Tunda">Tunda</option>
                    <option value="Konfirmasi">Konfirmasi</option>
                    <option value="Dalam Pembayaran">Dalam Pembayaran</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Batal">Batal</option>
                  </select>
                </td>
                <td className="text-start py-2 px-3 border">
                  <select
                    name="deliveryStatus"
                    value={sale.deliveryStatus}
                    onChange={(e) => handleStatus(e, sale._id)}
                  >
                    <option value="Tunda">Tunda</option>
                    <option value="Konfirmasi">Konfirmasi</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Terkirim">Terkirim</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Batal">Batal</option>
                  </select>
                </td>
                <td className="py-2 px-3 border">
                  <button
                    onClick={() => openConfirmationModal(sale._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-auto rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}> {/* Modifikasi */}
        <ModalBody>
          <p className="text-lg font-semibold text-center">Yakin ingin menghapus data penjualan?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowConfirmationModal(false)}>Batal</Button>
          <Button color="success" onClick={handleConfirmSubmit}>Iya</Button>
        </ModalFooter>
      </Modal>

      <Modal show={showEditConfirmationModal} onClose={() => setShowEditConfirmationModal(false)}>
        <ModalBody>
          <p className="text-lg font-semibold text-center">Yakin ingin mengubah data pembayaran?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowEditConfirmationModal(false)}>Batal</Button>
          <Button color="success" onClick={handleSave}>Iya</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default SalesPage;
