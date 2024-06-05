/* eslint-disable */
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function SalesNavigation() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Untuk mengatur state 'activeTab' berdasarkan pathnamenya

    if (location.pathname.includes("/sales/salesPage/*")) {
      setActiveTab("sales");
    } else if (location.pathname === "/sales") {
      setActiveTab("sales");
    } else if (
      location.pathname.includes("/sales/salesPage/addSales/*")
    ) {
      setActiveTab("addSales");
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
            to="/sales/salesPage/*"
            className={({ isActive }) =>
              isActive || activeTab === "sales"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center justify-center py-2 mr-3 w-36"
            }
            onClick={() => setActiveTab("sales")}
          >
            <div>
              <p>Penjualan</p>
            </div>
          </NavLink>
          <NavLink
            to="/sales/salesPage/addSales/*"
            className={({ isActive }) =>
              isActive || activeTab === "addSales"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center w-36 justify-center py-2 mr-3"
            }
            onClick={() => setActiveTab("addSales")}
          >
            <div>
              <p>Tambah Penjualan</p>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default SalesNavigation;
