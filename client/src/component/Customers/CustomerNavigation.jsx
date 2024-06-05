/* eslint-disable */
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function CustomerNavigation() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Untuk mengatur state 'activeTab' berdasarkan pathnamenya

    if (location.pathname.includes("/customer/customerPage/*")) {
      setActiveTab("pelanggan");
    } else if (location.pathname === "/customer") {
      setActiveTab("pelanggan");
    } else if (
        location.pathname.includes("/customer/customerPage/customerType/*")
      ) {
        setActiveTab("tipePelanggan");
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
            to="/customer/customerPage/*"
            className={({ isActive }) =>
              isActive || activeTab === "pelanggan"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center justify-center py-2 mr-3 w-36"
            }
            onClick={() => setActiveTab("pelanggan")}
          >
            <div>
              <p>Pelanggan</p>
            </div>
          </NavLink>
          <NavLink
            to="/customer/customerPage/customerType/*"
            className={({ isActive }) =>
              isActive || activeTab === "tipePelanggan"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center w-36 justify-center py-2 mr-3"
            }
            onClick={() => setActiveTab("tipePelanggan")}
          >
            <div>
              <p>Tipe Pelanggan</p>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default CustomerNavigation;
