/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import InventoryNavigation from "./InventoryNavigaton";
import FilterBarOut from "./components/FilterBarOut";
import PaginationComponent from "./components/PaginationComponent";
import { Modal, ModalBody, ModalFooter, Button } from "flowbite-react";

const InventoryOutStock = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mergeInventorySales, setMergeInventorySales] = useState([]);
  const [error, setError] = useState("");

  const [inventoryData, setInventoryData] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    statusSale: "",
    updatedBy: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // state untuk edit catatan dan status
  const [editItem, setEditItem] = useState(null);
  const [editedNote, setEditedNote] = useState("");
  const [editedStatus, setEditedStatus] = useState("");

  // Initialize an edit state array based on the merged data
  const [editStates, setEditStates] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  // Fetch stock out data
  useEffect(() => {
    fetchData();
  }, [currentPage, filters]);

  useEffect(() => {
    applyFilters();
  }, [inventoryData, filters, itemsPerPage]);

  const applyFilters = () => {
    let filteredData = inventoryData;
    if (filters.date) {
      filteredData = filteredData.filter(
        (data) =>
          new Date(data.sale.saleDate).toLocaleDateString() ===
          new Date(filters.date).toLocaleDateString(),
      );
    }
    if (filters.statusSale) {
      filteredData = filteredData.filter(
        (data) => data.sale.statusSale === filters.statusSale,
      );
    }
    if (filters.updatedBy) {
      filteredData = filteredData.filter(
        (data) =>
          data.stockItem.updatedBy &&
          data.stockItem.updatedBy.email
            .toLowerCase()
            .includes(filters.updatedBy.toLowerCase()),
      );
    }

    const offset = (currentPage - 1) * itemsPerPage;
    setMergeInventorySales(filteredData.slice(offset, offset + itemsPerPage));
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    applyFilters();
  };

  useEffect(() => {
    // This will re-initialize the editStates every time the mergeInventorySales is updated.
    if (mergeInventorySales.length > 0) {
      const initialEditStates = mergeInventorySales.map((data) => ({
        uniqueKey: `${data.sale._id}-${data.stockItem._id}`, // Use the unique key here
        noteSale: data.sale.noteSale,
        statusSale: data.sale.statusSale,
        isEditing: false,
      }));
      setEditStates(initialEditStates);
    }
  }, [mergeInventorySales]);

  const fetchData = async () => {
    setIsLoading(true);
    const token = Cookies.get("Token");
    const decoded = jwtDecode(token);
    const warehouseId = decoded.warehouse;

    try {
      const stockOutData = await fetchStockOutData(token);
      const salesData = await fetchSales(token, warehouseId);
      const mergedData = mergeData(stockOutData, salesData);

      setInventoryData(mergedData);
      setIsLoading(false);
    } catch (error) {
      setError("Gagal Fetching Data atau Jumlah Stok Tersedia Kurang!");
      setIsLoading(false);
    }
  };

  const fetchStockOutData = async (token) => {
    try {
      const response = await axios.get(
        "https://inventory-management-api.vercel.app/api/inventory/stock/stock-out",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch stock out data:", error);
      throw error;
    }
  };

  const fetchSales = async (token, warehouseId) => {
    try {
      const response = await axios.get(
        "https://inventory-management-api.vercel.app/api/sales",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { warehouse: warehouseId },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
      throw error;
    }
  };

  const mergeData = (stockOutData, salesData) => {
    const mergedData = [];

    stockOutData.forEach((stockItem) => {
      salesData.forEach((sale) => {
        sale.items.forEach((item) => {
          if (item.product && item.product._id === stockItem.product._id) {
            mergedData.push({
              _id: stockItem._id,
              stockItem: stockItem,
              sale: {
                ...sale,
                noteSale: sale.noteSale,
                statusSale: sale.statusSale,
              },
            });
          }
        });
      });
    });

    return mergedData;
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditedNote(item.stockItem.noteSale);
    setEditedStatus(item.stockItem.statusSale);
  };

  const handleEditClick = (uniqueKey) => {
    setError("");
    setEditStates((prevEditStates) =>
      prevEditStates.map((editState) =>
        editState.uniqueKey === uniqueKey
          ? { ...editState, isEditing: !editState.isEditing }
          : editState,
      ),
    );
  };

  const handleNoteChange = (uniqueKey, newNote) => {
    setEditStates((prevEditStates) =>
      prevEditStates.map((editState) =>
        editState.uniqueKey === uniqueKey
          ? { ...editState, noteSale: newNote }
          : editState,
      ),
    );
  };

  const handleStatusChange = (uniqueKey, newStatus) => {
    setEditStates((prevEditStates) =>
      prevEditStates.map((editState) =>
        editState.uniqueKey === uniqueKey
          ? { ...editState, statusSale: newStatus }
          : editState,
      ),
    );
  };

  const confirmEdit = (item) => {
    setEditItem(item);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editItem) return;

    const uniqueKey = `${editItem.sale._id}-${editItem.stockItem._id}`;
    const editState = editStates.find((state) => state.uniqueKey === uniqueKey);
    const token = Cookies.get("Token");
    const saleId = uniqueKey.split("-")[0];

    try {
      await axios.put(
        `https://inventory-management-api.vercel.app/api/sales/${saleId}`,
        {
          noteSale: editState.noteSale,
          statusSale: editState.statusSale,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Deactivate editing mode for the selected item
      setEditStates((prevEditStates) =>
        prevEditStates.map((state) =>
          state.uniqueKey === uniqueKey
            ? { ...state, isEditing: false }
            : state,
        ),
      );

      fetchData();

      setShowEditModal(false);
    } catch (error) {
      console.error("Gagal upadte stok keluar:", error);
      setError(error.response?.data?.message || "Gagal upadte stok keluar");
    }

    setEditItem(null);
  };

  const handleCancel = (uniqueKey) => {
    // Cancel editing mode for the selected item
    setEditStates((prevEditStates) =>
      prevEditStates.map((editState) =>
        editState.uniqueKey === uniqueKey
          ? { ...editState, isEditing: false }
          : editState,
      ),
    );
  };

  const handleOrderNumberClick = (saleId) => {
    navigate(`/sales/salesPage/saleDetail/${saleId}`);
  };

  return (
    <>
      <InventoryNavigation />
      <FilterBarOut onChange={setFilters} initialFilters={filters} />
      <div className="container px-8">
        <div className="overflow-x-auto shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full h-16 border-gray-300 border-b py-8">
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-md">
                  No. Pesanan
                </th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Transfer Ke
                </th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Catatan
                </th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Dibuat Oleh
                </th>
                <th className="px-5 py-3 bg-gray-800 text-start text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-md">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {mergeInventorySales.map((data) => {
                const uniqueKey = `${data.sale._id}-${data.stockItem._id}`;
                const editState = editStates.find(
                  (state) => state.uniqueKey === uniqueKey,
                );

                if (!editState) {
                  return (
                    <tr key={uniqueKey}>
                      <td colSpan="7">Loading...</td>
                    </tr>
                  );
                }

                return (
                  <tr key={uniqueKey} className="text-gray-700 border-b">
                    <td
                      className="px-5 py-3 cursor-pointer text-blue-500 hover:text-blue-800"
                      onClick={() => handleOrderNumberClick(data.sale._id)}
                    >
                      {data.sale.orderNumber}
                    </td>
                    <td className="px-5 py-2 text-sm text-gray-900">
                      {data.sale.items.map((item) => item.product.name)}
                    </td>
                    <td className="px-5 py-2 text-sm text-gray-900">
                      {data.sale.items.map((item) => item.quantity)}
                    </td>
                    <td className="px-5 py-2 text-sm text-gray-900">
                      {data.sale.customer.name}
                    </td>
                    <td className="px-5 py-2 text-sm text-gray-900">
                      {new Date(data.sale.saleDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-2 text-sm text-gray-900">
                      {editState.isEditing ? (
                        <input
                          type="text"
                          value={editState.noteSale}
                          onChange={(e) =>
                            handleNoteChange(uniqueKey, e.target.value)
                          }
                        />
                      ) : (
                        data.sale.noteSale
                      )}
                    </td>
                    <td className="px-5 py-2 text-sm text-gray-900">
                      {editState.isEditing ? (
                        <select
                          value={editState.statusSale}
                          onChange={(e) =>
                            handleStatusChange(uniqueKey, e.target.value)
                          }
                        >
                          <option value="Waiting">Waiting</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      ) : (
                        data.sale.statusSale
                      )}
                    </td>
                    <td className="px-5 py-2 text-sm text-gray-900">
                      {data.stockItem.createdBy.email}
                    </td>
                    <td className="text-start p-4">
                      {editState.isEditing ? (
                        <>
                          <button
                            onClick={() => confirmEdit(data)}
                            className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm w-20 px-4 py-2 mb-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleCancel(uniqueKey)}
                            className="text-white bg-gray-500 hover:bg-gray-700 font-medium rounded-lg text-sm w-20 px-4 py-2"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditClick(uniqueKey)}
                          className="text-white bg-green-500 hover:bg-green-700 font-medium rounded-lg text-sm w-20 px-4 py-2"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal untuk konfirmasi edit */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalBody className="text-center">
          <p>Yakin ingin mengubah Catatan atau Status?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="blue" onClick={handleSave}>
            Konfirmasi
          </Button>
          <Button color="gray" onClick={() => setShowEditModal(false)}>
            Batal
          </Button>
        </ModalFooter>
      </Modal>

      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2">
          {error}
        </div>
      )}

      <div className="flex ml-6 mt-3 items-center">
        <div className="flex justify-end p-2">
          <select
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="10">10/page</option>
            <option value="20">20/page</option>
            <option value="50">50/page</option>
          </select>
        </div>
        <div>
          <PaginationComponent
            totalItems={inventoryData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default InventoryOutStock;
