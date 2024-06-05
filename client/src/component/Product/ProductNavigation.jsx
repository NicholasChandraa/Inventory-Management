/* eslint-disable */
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function ProductNavigation() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Untuk mengatur state 'activeTab' berdasarkan pathnamenya

    if (location.pathname.includes("/Product/ProductPage")) {
      setActiveTab("product");
    } else if (location.pathname === "/Product") {
      setActiveTab("product");
    } else if (location.pathname.includes("/Product/ProductCategory")) {
      setActiveTab("category");
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
            to="/Product/ProductPage"
            className={({ isActive }) =>
              isActive || activeTab === "product"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center justify-center py-2 mr-3 w-36"
            }
            onClick={() => setActiveTab("product")}
          >
            <div>
              <p>Produk</p>
            </div>
          </NavLink>
          <NavLink
            to="/Product/ProductCategory"
            className={({ isActive }) =>
              isActive || activeTab === "category"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center w-36 justify-center py-2 mr-3"
            }
            onClick={() => setActiveTab("category")}
          >
            <div>
              <p>Kategori</p>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default ProductNavigation;
