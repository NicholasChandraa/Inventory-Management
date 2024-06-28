/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import PaginationComponent from "./PaginationComponent";
import { Modal, ModalBody, ModalFooter, Button } from "flowbite-react";

const StockTable = ({ stockItems, fetchInventoryItems }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showEditModal, setShowEditModal] = useState(false); // Modal untuk konfirmasi edit data status atau catatan
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal untuk konfirmasi hapus data di entri stok masuk
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // State untuk logic dalam memilih data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = stockItems.slice(
    currentPage * itemsPerPage - itemsPerPage,
    currentPage * itemsPerPage,
  );

  // State untuk logic status
  const [editRowId, setEditRowId] = useState(null);
  const [editedNote, setEditedNote] = useState("");
  const [editedStatus, setEditedStatus] = useState("");

  useEffect(() => {}, [currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleEdit = (item) => {
    setEditRowId(item._id);
    setEditedNote(item.noteIn || "");
    setEditedStatus(item.statusIn || "Waiting");
  };

  const confirmEdit = (item) => {
    setItemToEdit(item);
    setShowEditModal(true);
  };

  const saveEdit = async (item) => {
    const token = Cookies.get("Token");

    console.log(editedNote);

    try {
      await axios.put(
        `https://inventory-management-api.vercel.app/api/inventory/stock/${itemToEdit._id}`,
        {
          noteIn: editedNote,
          statusIn: editedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Berhasil update Data");
      fetchInventoryItems();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error dalam update data: ", error);
    }
    setEditRowId(null);
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async (item) => {
    const token = Cookies.get("Token");
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // First delete the inventory item
      await axios.delete(
        `https://inventory-management-api.vercel.app/api/inventory/stock/${itemToDelete._id}`,
        headers,
      );
      console.log("Inventory item deleted successfully.");

      // Then delete the associated product if it exists
      if (itemToDelete.product && itemToDelete.product._id) {
        await axios.delete(
          `https://inventory-management-api.vercel.app/api/product/${itemToDelete.product._id}`,
          headers,
        );
        console.log("Product deleted successfully.");
      }

      // Refresh inventory items to reflect the changes
      fetchInventoryItems();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error during deletion process: ", error);
    }
  };

  // Fungsi untuk mengatur halaman saat ini
  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="m-4 md:m-6">
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal border shadow mb-5">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-md">
                ID.
              </th>
              <th className="px-3 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Nama Produk
              </th>
              <th className="px-3 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Stok Masuk
              </th>
              <th className="px-3 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-3 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Catatan
              </th>
              <th className="px-3 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Dibuat Oleh
              </th>
              <th className="px-3 py-3 bg-gray-800 text-start text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-md">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-5 py-3 text-blue-500 hover:text-blue-800">
                    <Link to={`/product/ProductDetailPage/${item.product._id}`}>
                      {`ID-${item._id.slice(-8)}`}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {item.product.name}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {item.inQuantity}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {new Date(item.updatedAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {editRowId === item._id ? (
                      <input
                        type="text"
                        className="form-input mt-1 block w-full px-1 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        value={editedNote}
                        onChange={(e) => setEditedNote(e.target.value)}
                      />
                    ) : (
                      item.noteIn
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {editRowId === item._id ? (
                      <select
                        className="form-select mt-1 block w-full px-1 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      item.statusIn
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {item.createdBy.email}
                  </td>
                  <td
                    className={`px-3 py-2 text-sm text-gray-900 text-center ${index === currentItems.length - 1 ? "border-b" : "border-b border-gray-200"}`}
                  >
                    {editRowId === item._id ? (
                      <button
                        onClick={() => confirmEdit(item)}
                        className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 w-16 py-2 mb-2 lg:mb-0 text-center"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 w-16 py-2 mb-2 lg:mb-0 text-center"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => confirmDelete(item)}
                      className="text-white bg-red-500 hover:bg-red-700 font-medium rounded-lg text-sm px-4 ml-2 py-2 text-center"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-3">
                  Tidak ada data / Data kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal untuk konfirmasi edit */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalBody className="text-center">
          <p>Yakin ingin mengubah Catatan atau Status?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="blue" onClick={saveEdit}>
            Konfirmasi
          </Button>
          <Button color="gray" onClick={() => setShowEditModal(false)}>
            Batal
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal untuk konfirmasi delete */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalBody className="text-center">
          <p>Apakah Anda yakin ingin menghapus item ini dan produk terkait?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="red" onClick={handleDelete}>
            Hapus
          </Button>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
        </ModalFooter>
      </Modal>
      {/* Pagination Component */}
      <div className="mb-4 mt-2 flex flex-col md:flex-row items-center">
        <div className="mb-4 md:mb-0">
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="rounded-lg mr-4 font-medium"
          >
            <option value={10}>10/page</option>
            <option value={20}>20/page</option>
            <option value={50}>50/page</option>
          </select>
        </div>
        <PaginationComponent
          totalItems={stockItems.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
};

export default StockTable;
