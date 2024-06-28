/* eslint-disable */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductNavigation from "../ProductNavigation";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Modal, ModalBody, ModalFooter, Button } from "flowbite-react";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sku: "",
    quantity: 0,
    unit: "",
    purchasePrice: 0,
    sellPrice: 0,
    user: "",
    warehouse: "",
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // state untuk konfirmasi modal

  function getUserIdFromToken() {
    const token = Cookies.get("Token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.id;
    } else {
      return console.log("Token tidak ada !..");
    }
  }

  useEffect(() => {
    const userId = getUserIdFromToken();

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://inventory-management-api.vercel.app/api/product/${id}`,
        );
        const productData = response.data;

        setFormData({
          name: productData.name || "",
          category: productData.category?.name || "",
          sku: productData.sku || "",
          quantity: productData.quantity || 0,
          unit: productData.unit || "",
          purchasePrice: productData.purchasePrice || 0,
          sellPrice: productData.sellPrice || 0,
          user: userId,
          warehouse: productData.warehouse?._id || "",
        });
      } catch (error) {
        console.error("Error Update fetching product data: ", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmationModal(false);
    const dataToSubmit = {
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      purchasePrice: Number(formData.purchasePrice),
      sellPrice: Number(formData.sellPrice),
      warehouse: formData.warehouse,
      user: formData.user,
    };

    try {
      const response = await axios.put(
        `https://inventory-management-api.vercel.app/api/product/${id}`,
        dataToSubmit,
      );
      console.log(response.data);
      navigate("/product");
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "number"
        ? e.target.value === ""
          ? ""
          : Number(e.target.value)
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <>
      <ProductNavigation />

      <div className="pt-4">
        <div className="max-w-4xl mx-auto py-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Daftar Produk</h2>
            <div className="border-b-2 mb-5"></div>
            <form onSubmit={handleSubmit} className="md:grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Nama Produk
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded shadow-sm mb-4"
                  placeholder="Masukkan nama produk"
                />

                <label
                  htmlFor="category"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Nama Kategori
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded shadow-sm mb-4"
                  placeholder="Masukkan ID Kategori"
                />

                <label
                  htmlFor="unit"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Satuan
                </label>
                <input
                  id="unit"
                  name="unit"
                  type="text"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded shadow-sm mb-4"
                  placeholder="Masukkan satuan produk"
                />

                <label
                  htmlFor="purchasePrice"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Harga Beli
                </label>
                <input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded shadow-sm"
                  placeholder="Masukkan harga beli"
                />
              </div>

              {/* Right Column */}
              <div>
                <label
                  htmlFor="sku"
                  className="block mb-2 font-medium text-gray-700"
                >
                  SKU
                </label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  value={formData.sku}
                  readOnly
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded shadow-sm mb-4"
                  placeholder="SKU (not editable)"
                />

                <label
                  htmlFor="quantity"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Jumlah
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  readOnly
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded shadow-sm mb-4"
                  placeholder="jumlah (not editable)"
                />

                <label
                  htmlFor="sellPrice"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Harga Jual
                </label>
                <input
                  id="sellPrice"
                  name="sellPrice"
                  type="number"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded shadow-sm"
                  placeholder="Masukkan harga jual"
                />
              </div>

              {/* Hidden inputs */}
              <input type="hidden" name="user" value={formData.user} />
              <input
                type="hidden"
                name="warehouse"
                value={formData.warehouse}
              />

              {/* Buttons */}
              <div className="col-span-2 flex justify-end items-center mt-4 space-x-4">
                <Link
                  to="/Product"
                  className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                >
                  Edit Produk
                </button>
              </div>
            </form>
            <Modal
              show={showConfirmationModal}
              onClose={() => setShowConfirmationModal(false)}
            >
              <ModalBody>
                <p className="text-lg font-semibold text-center">
                  Yakin ingin mengedit Produk?
                </p>
              </ModalBody>
              <ModalFooter className="justify-center">
                <Button
                  color="failure"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Batal
                </Button>
                <Button color="success" onClick={handleConfirmSubmit}>
                  Iya
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProduct;
