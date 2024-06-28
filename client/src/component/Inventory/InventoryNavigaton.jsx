/* eslint-disable */
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function InventoryNavigation() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Untuk mengatur state 'activeTab' berdasarkan pathnamenya

    if (location.pathname.includes("/inventory/inventoryPage/*")) {
      setActiveTab("stokMasuk");
    } else if (location.pathname === "/inventory") {
      setActiveTab("stokMasuk");
    } else if (
      location.pathname.includes("/inventory/inventoryPage/InventoryOutStock/*")
    ) {
      setActiveTab("stokKeluar");
    } else if (
      location.pathname.includes("/inventory/inventoryPage/InventoryOutStock/*")
    ) {
      setActiveTab("pergerakanStok");
    } else {
      setActiveTab("");
    }
  }, [location.pathname]);

  const activeLinkClass = "bg-blue-100 rounded-md";

  return (
    <>
      <div className="flex h-16 items-center shadow px-4 py-2 font-medium w-full">
        <div className="flex w-full justify-start h-full">
          <NavLink
            to="/inventory/inventoryPage/*"
            className={({ isActive }) =>
              isActive || activeTab === "stokMasuk"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center justify-center py-2 mr-3 w-36"
            }
            onClick={() => setActiveTab("stokMasuk")}
          >
            <div>
              <p>Stok Masuk</p>
            </div>
          </NavLink>
          <NavLink
            to="/inventory/inventoryPage/InventoryOutStock/*"
            className={({ isActive }) =>
              isActive || activeTab === "stokKeluar"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center w-36 justify-center py-2 mr-3"
            }
            onClick={() => setActiveTab("stokKeluar")}
          >
            <div>
              <p>Stok Keluar</p>
            </div>
          </NavLink>
          <NavLink
            to="/inventory/inventoryPage/InventoryStockMovement/*"
            className={({ isActive }) =>
              isActive || activeTab === "pergerakanStok"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center w-36 justify-center py-2 mr-3"
            }
            onClick={() => setActiveTab("pergerakanStok")}
          >
            <div>
              <p>Pergerakan Stok</p>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default InventoryNavigation;
