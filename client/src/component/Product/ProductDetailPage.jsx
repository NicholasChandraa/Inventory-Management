/* eslint-disable */
import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

function ProductDetailPage() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchProduct();
    fetchInventory();
  }, [id]);

  const fetchProduct = async () => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.get(
        `https://inventory-management-api.vercel.app/api/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProduct(response.data);
      console.log("Product found! ");
    } catch (error) {
      console.error("Error fetching product: ", error);
    }
  };

  const fetchInventory = async () => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.get(
        `https://inventory-management-api.vercel.app/api/inventory/stock/byproduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items: ", error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white shadow-lg rounded-lg p-6">
        <div className="border-b pb-5">
          <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
          <p className="mt-2 text-sm text-gray-600">SKU: {product.sku}</p>
        </div>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <li className="col-span-1 bg-white rounded-lg">
            <div className="p-6 transition duration-500 ease-in-out transform hover:-translate-y-1 shadow hover:shadow-2xl rounded-lg">
              <span className="block text-sm font-medium text-gray-500">
                Kategori
              </span>
              <span className="mt-1 text-sm text-gray-900">
                {product.category?.name}
              </span>
            </div>
          </li>
          <li className="col-span-1 bg-white rounded-lg">
            <div className="p-6 transition duration-500 ease-in-out transform hover:-translate-y-1 shadow hover:shadow-2xl rounded-lg">
              <span className="block text-sm font-medium text-gray-500">
                Quantity / Jumlah
              </span>
              <span className="mt-1 text-sm text-gray-900">
                {product.quantity}
              </span>
            </div>
          </li>
          <li className="col-span-1 bg-white rounded-lg">
            <div className="p-6 transition duration-500 ease-in-out transform hover:-translate-y-1 shadow hover:shadow-2xl rounded-lg">
              <span className="block text-sm font-medium text-gray-500">
                Satuan
              </span>
              <span className="mt-1 text-sm text-gray-900">{product.unit}</span>
            </div>
          </li>
          <li className="col-span-1 bg-white rounded-lg">
            <div className="p-6 transition duration-500 ease-in-out transform hover:-translate-y-1 shadow hover:shadow-2xl rounded-lg">
              <span className="block text-sm font-medium text-gray-500">
                Harga Beli
              </span>
              <span className="mt-1 text-green-600 font-semibold">
                Rp. {product.purchasePrice.toFixed(2)}
              </span>
            </div>
          </li>
          <li className="col-span-1 bg-white rounded-lg">
            <div className="p-6 transition duration-500 ease-in-out transform hover:-translate-y-1 shadow hover:shadow-2xl rounded-lg">
              <span className="block text-sm font-medium text-gray-500">
                Harga Jual
              </span>
              <span className="mt-1 text-red-600 font-semibold">
                Rp. {product.sellPrice.toFixed(2)}
              </span>
            </div>
          </li>
          <li className="col-span-1 bg-white rounded-lg">
            <div className="p-6 transition duration-500 ease-in-out transform hover:-translate-y-1 shadow hover:shadow-2xl rounded-lg">
              <span className="block text-sm font-medium text-gray-500">
                Gudang
              </span>
              <span className="mt-1 text-sm text-gray-900">
                {product.warehouse?.name}
              </span>
            </div>
          </li>
        </ul>

        {inventoryItems.map((inventory) => (
          <div
            key={inventory._id}
            className="bg-white shadow transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl rounded-lg p-6 mb-5"
          >
            <h3 className="text-lg leading-6 font-semibold text-gray-900">
              Detail Inventori
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              <div>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500">
                      Inventori ID
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {inventory._id}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500">
                      Terakhir Diperbarui
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {new Date(inventory.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500">
                      Catatan
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {inventory.noteIn}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500">
                      Status
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {inventory.statusIn}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">
                  Diterima oleh
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {inventory.createdBy.email || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between space-x-4">
          <Link
            to="/Product"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl rounded-lg"
          >
            Balik ke Produk
          </Link>
          <Link
            to="/inventory/inventoryPage/*"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl rounded-lg"
          >
            Balik ke Inventori
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
