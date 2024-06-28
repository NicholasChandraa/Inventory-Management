/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import ProductNavigation from "./ProductNavigation";
import { Modal, ModalBody, ModalFooter, Button } from "flowbite-react";

function ProductCategory() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  //   Modul untuk confirm hapus kategori
  const [showModal, setShowModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUsedCategoryModal, setShowUsedCategoryModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.get(
        "https://inventory-management-api.vercel.app/api/product/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCategories(response.data);
    } catch (error) {
      console.log("Gagal fetching Categories");
      console.error(`Error fetching categories:`, error);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      alert("Nama kategori tidak boleh kosong!");
      return;
    }

    const token = Cookies.get("Token");

    try {
      const response = await axios.post(
        "https://inventory-management-api.vercel.app/api/product/categories",
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCategories([...categories, response.data]);
      setNewCategory("");
    } catch (error) {
      console.error(`Error menambahkan kategori: ${error}`);
      alert(
        `Error menambahkan category: ${error.response ? error.response.data : error.message}`,
      );
    }
  };

  const deleteCategory = async (categoryId) => {
    setShowModal(false);

    const token = Cookies.get("Token");

    try {
      const productResponse = await axios.get(
        "https://inventory-management-api.vercel.app/api/product/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const isCategoryUsed = productResponse.data.some(
        (product) => product.category && product.category._id === categoryId,
      );

      if (isCategoryUsed) {
        setShowUsedCategoryModal(true);
        return;
      }

      const deleteResponse = await axios.delete(
        `https://inventory-management-api.vercel.app/api/product/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCategories(
        categories.filter((category) => category._id !== categoryId),
      );
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  const handleDeleteClick = (categoryId) => {
    setShowModal(true);
    setCategoryIdToDelete(categoryId);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleConfirmAdd = () => {
    addCategory();
    setShowAddModal(false);
  };

  const handleCloseUsedCategoryModal = () => {
    setShowUsedCategoryModal(false);
  };

  return (
    <>
      <ProductNavigation />
      <div className="flex flex-col lg:flex-row p-4 md:p-6">
        <div className="shadow-md w-full lg:w-1/2 rounded flex flex-col h-auto lg:h-[290px] mb-6 lg:mb-0">
          <div className="flex justify-between pt-6 px-4 mb-5">
            <h2 className="text-xl font-bold text-gray-800">Tambah Kategori</h2>
            <button
              className="text-white font-bold py-2 px-4 rounded bg-[#67C23A] hover:bg-[#59B32D] active:bg-[#397B18]"
              onClick={handleAddClick}
            >
              Tambah
            </button>
          </div>

          <hr className="border-t border-gray-400 w-full" />

          <div className="flex flex-col lg:flex-row mt-6 lg:mt-10 p-4 w-full items-center">
            <div className="text-start lg:text-end pr-0 lg:pr-3 w-full lg:w-auto mb-4 lg:mb-0">
              <h3 className="text-base font-bold text-gray-700 mb-2">
                Nama Kategori:
              </h3>
              <p className="text-sm text-gray-700">
                Kategori Produk, untuk memudahkan pengguna dalam mencari produk
              </p>
            </div>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="rounded-md w-full h-14"
            />
          </div>
        </div>
        <div className="shadow-md rounded w-full lg:w-1/2 lg:ml-6">
          <h2 className="font-bold text-xl py-7 px-4">Kategori List</h2>
          <hr className="border-t border-gray-400 w-full" />
          <div className="my-8">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex mx-4 mt-6 border border-gray-300 rounded px-4 py-2 justify-between font-medium"
              >
                <p className="text-base">{category.name}</p>

                <button
                  onClick={() => handleDeleteClick(category._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-80 md:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Hapus Kategori
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini
                  tidak dapat dibatalkan.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => deleteCategory(categoryIdToDelete)}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Hapus
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="ml-3 px-4 py-2 bg-gray-300 text-gray-900 text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
          <ModalBody>
            <p className="text-lg font-semibold text-center">
              Yakin ingin menambahkan kategori baru?
            </p>
          </ModalBody>
          <ModalFooter className="justify-center">
            <Button color="failure" onClick={() => setShowAddModal(false)}>
              Batal
            </Button>
            <Button color="success" onClick={handleConfirmAdd}>
              Iya
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {showUsedCategoryModal && (
        <Modal
          show={showUsedCategoryModal}
          onClose={handleCloseUsedCategoryModal}
        >
          <ModalBody>
            <p className="text-lg font-semibold text-center">
              Terdapat Produk yang memiliki kategori ini! (Tidak dapat dihapus)
            </p>
          </ModalBody>
          <ModalFooter className="justify-center">
            <Button color="success" onClick={handleCloseUsedCategoryModal}>
              OK
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}

export default ProductCategory;
