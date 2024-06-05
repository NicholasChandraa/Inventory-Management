/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import InventoryNavigation from "./InventoryNavigaton";

function InventoryStockMovement() {
  const [stockMovements, setStockMovements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  

  const navigate = useNavigate();

  useEffect(() => {
    fetchStockMovement();
  }, []);

  const filteredStockMovements = searchTerm
    ? stockMovements.filter((movement) =>
        movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stockMovements;

  function getUserToken() {
    const token = Cookies.get("Token");
    return token;
  }

  function getWarehouseId() {
    const token = getUserToken();
    const decoded = jwtDecode(token);
    const warehouseId = decoded.warehouse;
    return warehouseId;
  }

  const fetchStockMovement = async () => {

    const token = getUserToken();
    const warehouseId = getWarehouseId();

    try {
      const response = await axios.get(
        "https://inventory-management-api.vercel.app/api/inventory/stock/stock-movements", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {warehouse: warehouseId}
        }
      );
      
      setStockMovements(response.data);
    } catch (error) {
        console.error("Gagal dalam fetching stock movement: ", error);
    }
  };

  const handleOrderNumberClick = (id) => {
    navigate(`/inventory/inventoryPage/InventoryStockMovement/Detail/${id}`);
  };

  return (
    <>
      <InventoryNavigation />
      <div className="container   p-8">
      <h2 className="text-2xl font-semibold mb-4">PERGERAKAN STOK</h2>
      <div className="mb-4">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      <div className="border-b-2 mb-5"></div>
      <div className="overflow-x-auto shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="w-full h-16 border-gray-300 border-b py-8">
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-md">Kategori</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Nama Produk</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">SKU</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Total Stok Masuk</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Stok Masuk</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Stok Keluar</th>
              <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-md">Sisa Stok</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockMovements.map((movement, index) => (
              <tr key={index} className="h-14 border-gray-300 border-b">
                <td className="px-6">{movement.category}</td>
                <td className="px-6 cursor-pointer text-blue-600 hover:text-blue-800" onClick={() => handleOrderNumberClick(movement.productId)}>{movement.productName}</td>
                <td className="px-6">{movement.sku}</td>
                <td className="px-6">{movement.initialQuantity}</td>
                <td className="px-6">{movement.inQuantity}</td>
                <td className="px-6">{movement.saleQuantity}</td>
                <td className="px-6">{movement.finalQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default InventoryStockMovement;
