/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

function StockMovementDetails() {
  const [product, setProduct] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [sales, setSales] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.get(
        `https://inventory-management-api.vercel.app/api/inventory/stock/stock-movement/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);
      const { product, inventoryStocks, sales } = response.data;

      setProduct(product);
      setInventoryItems(inventoryStocks);
      setSales(sales);

      console.log("Product and inventory details found! ");
    } catch (error) {
      console.error("Error fetching details: ", error);
    }
  };

  if (!product || !inventoryItems) {
    return <div>Loading...</div>;
  }

  //   Untuk Ubah Style Currency
  const formatCurrency = (value) => {
    const number = parseFloat(value);
    const formattedNumber = number.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `Rp. ${formattedNumber}`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="container p-6">
      <div className="bg-white p-5 shadow rounded-lg">
        <h1 className="text-xl text-center font-bold text-gray-800 mb-4">
          PERGERAKAN STOK DETAIL
        </h1>
        <div className="border-b mb-3"></div>
        {/* Product Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Informasi Produk
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm font-medium text-gray-500">Name:</div>
            <div className="text-sm font-bold text-gray-900">
              {product.name}
            </div>

            <div className="text-sm font-medium text-gray-500">SKU:</div>
            <div className="text-sm font-bold text-gray-900">{product.sku}</div>

            <div className="text-sm font-medium text-gray-500">Kategori:</div>
            <div className="text-sm font-bold text-gray-900">
              {product.category?.name}
            </div>

            <div className="text-sm font-medium text-gray-500">Satuan:</div>
            <div className="text-sm font-bold text-gray-900">
              {product.unit}
            </div>

            <div className="text-sm font-medium text-gray-500">
              Harga Beli:
            </div>
            <div className="text-sm font-bold text-gray-900">
              {formatCurrency(product.purchasePrice)}
            </div>

            <div className="text-sm font-medium text-gray-500">Harga Jual:</div>
            <div className="text-sm font-bold text-gray-900">
              {formatCurrency(product.sellPrice)}
            </div>

            <div className="text-sm font-medium text-gray-500">Gudang:</div>
            <div className="text-sm font-bold text-gray-900">
              {product.warehouse?.name}
            </div>
          </div>
        </div>

        {/* Inventory Records */}
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Data Inventori
        </h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full h-16 border-gray-300 border-b py-8">
                <th className="text-left px-6">Inventori ID</th>
                <th className="text-left px-6">Tanggal Diperbarui</th>
                <th className="text-left px-6">Total Stok Masuk</th>
                <th className="text-left px-6">Stok Masuk</th>
                <th className="text-left px-6">Stok Keluar</th>
                <th className="text-left px-6">Sisa Stok</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((inventory) => (
                <tr
                  key={inventory._id}
                  className="h-14 border-gray-300 border-b"
                >
                  <td className="px-6">{inventory._id}</td>
                  <td className="px-6">{formatDate(inventory.updatedAt)}</td>
                  <td className="px-6">{inventory.initialQuantity}</td>
                  <td className="px-6">{inventory.inQuantity}</td>
                  <td className="px-6">{inventory.saleQuantity}</td>
                  <td className="px-6">{inventory.finalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sales Records */}
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Data Penjualan
        </h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full h-16 border-gray-300 border-b py-8">
                <th className="text-left px-6">Sale ID</th>
                <th className="text-left px-6">Order Number</th>
                <th className="text-left px-6">Tanggal Penjualan</th>
                <th className="text-left px-6">Pelanggan</th>
                <th className="text-left px-6">Total Harga</th>
                <th className="text-left px-6">Pembayaran Diterima</th>
                <th className="text-left px-6">Sisa Pembayaran</th>
                <th className="text-left px-6">Status Pembayaran</th>
                <th className="text-left px-6">Status Pengiriman</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through each sale item */}
              {sales.map((sale) => (
                <tr key={sale._id} className="h-14 border-gray-300 border-b">
                  <td className="px-6">{sale._id}</td>
                  <td className="px-6">{sale.orderNumber}</td>
                  <td className="px-6">{formatDate(sale.saleDate)}</td>
                  <td className="px-6">{sale.customer.name}</td>
                  <td className="px-6 w-full">{formatCurrency(sale.totalAmount)}</td>
                  <td className="px-2 text-center">
                    {formatCurrency(sale.paymentReceived)}
                  </td>
                  <td className="px-4 text-center">
                    {formatCurrency(sale.remainingAmount)}
                  </td>
                  <td className="px-6">{sale.paymentStatus}</td>
                  <td className="px-6">{sale.deliveryStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Link
            to="/inventory/inventoryPage/InventoryStockMovement/*"
            className="text-indigo-600 hover:text-indigo-900"
          >
            Balik ke Inventori
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StockMovementDetails;
