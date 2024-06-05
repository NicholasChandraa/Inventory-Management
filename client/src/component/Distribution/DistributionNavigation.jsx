/* eslint-disable */
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function DistributionNavigation() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Untuk mengatur state 'activeTab' berdasarkan pathnamenya

    if (location.pathname.includes("/distribution/distributionPage/*")) {
      setActiveTab("distribution");
    } else if (location.pathname === "/distribution") {
      setActiveTab("distribution");
    } else if (
      location.pathname.includes("/distribution/distributionPage/addDistribution/*")
    ) {
      setActiveTab("addDistribution");
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
            to="/distribution/distributionPage/*"
            className={({ isActive }) =>
              isActive || activeTab === "distribution"
                ? `${activeLinkClass} flex items-center w-36 justify-center py-2 mr-3`
                : "flex items-center justify-center py-2 mr-3 w-36"
            }
            onClick={() => setActiveTab("distribution")}
          >
            <div>
              <p>Distribusi</p>
            </div>
          </NavLink>
          <NavLink
            to="/distribution/distributionPage/addDistribution/*"
            className={({ isActive }) =>
              isActive || activeTab === "addDistribution"
                ? `${activeLinkClass} flex items-center w-40 justify-center py-2 mr-3`
                : "flex items-center w-36 justify-center py-2 mr-3"
            }
            onClick={() => setActiveTab("addDistribution")}
          >
            <div>
              <p>Tambah Distribusi</p>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default DistributionNavigation;
