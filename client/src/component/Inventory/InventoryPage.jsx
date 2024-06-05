/* eslint-disable */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Import Component
import StockTable from "./components/StockTable";
import FilterBar from "./components/FilterBar";
import StockForm from "./components/StockTable";
import InventoryNavigation from "./InventoryNavigaton";

function InventoryPage() {
  const [inventoryStock, setInventoryStock] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    statusIn: "",
    updatedBy: "",
  });

  useEffect(() => {
    fetchInventoryItems();
  }, [filters]);

  const fetchInventoryItems = useCallback(async () => {
    const token = Cookies.get("Token");

    if (!token) {
      console.log("Token Tidak Ada!");
    }

    const decoded = jwtDecode(token);
    const warehouseId = decoded.warehouse;

    const params = { ...filters, warehouse: warehouseId };

    try {
      const response = await axios.get(
        "https://inventory-management-api.vercel.app/api/inventory/stock",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params,
        },
      );

      if (Array.isArray(response.data)) {
        setInventoryStock(response.data);
      } else {
        console.error("Data yang diterima bukan array");
      }
    } catch (error) {
      console.error("Error fetching stock items:", error);
    }
  }, [filters]);

  const handleFilterChange = (filterValues) => {
    setFilters(filterValues);
    fetchInventoryItems();
  };

  const handleClearFilters = () => {
    setFilters({
      date: "",
      statusIn: "",
      updatedBy: "",
    });
    fetchInventoryItems();
  };

  return (
    <>
      <InventoryNavigation />
      <div className="pt-8 pl-8">
        <h2 className="text-2xl font-semibold mb-4">STOK MASUK</h2>
        <div className="border-b-2 mb-5"></div>
      </div>
      <div>
        <FilterBar
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          initialFilters={filters}
        />

        <StockTable
          stockItems={inventoryStock}
          fetchInventoryItems={fetchInventoryItems}
        />
      </div>
    </>
  );
}

export default InventoryPage;
