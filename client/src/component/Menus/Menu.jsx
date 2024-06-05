/* eslint-disable */

import React, { useState } from "react";
import styles from "./Menus.module.css";
import iconDashboard from "../../assets/iconDashboard.png";
import iconProduct from "../../assets/iconProduct.png";
import iconInventory from "../../assets/iconInventory.png";
import iconCustomer from "../../assets/iconCustomer.png";
import iconSelling from "../../assets/iconSelling.png";
import iconDistribution from "../../assets/iconDistribution.png";
import iconSetting from "../../assets/iconSetting.png";
import { NavLink, Link } from "react-router-dom";

function Menu() {
  const activeLinkClass = "bg-blue-100 rounded-md";

  return (
    <>
      <div
        className={`flex flex-col py-7 px-4 font-semibold ${styles.container}`}
      >
        {/* MENU DASHBOARD */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? `${activeLinkClass} flex items-center w-full py-1 px-5`
              : "flex items-center w-full py-1 px-5"
          }
        >
          <img
            src={iconDashboard}
            alt="Icon Dashboard"
            className={`mr-2 ${styles.iconImages}`}
          />
          <p>Dashboard</p>
        </NavLink>

        {/* TEXT KATALOG */}
        <div className="flex flex-col items-center py-1 mt-5">
          <div className="border-t border-gray-900 w-full "></div>
          <p className="font-semibold tracking-wider">KATALOG</p>
          <div className="border-t border-gray-900 w-full mb-5"></div>
        </div>

        {/* MENU PRODUCT */}
        <NavLink
          to="/Product"
          className={({ isActive }) =>
            isActive
              ? `${activeLinkClass} flex items-center w-full py-1 px-5`
              : "flex items-center w-full py-1 px-5"
          }
        >
          <img
            src={iconProduct}
            alt="Icon Dashboard"
            className={`mr-2 ${styles.iconImages}`}
          />
          <p>Produk</p>
        </NavLink>

        {/* MENU INVENTORI */}
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            isActive
              ? `${activeLinkClass} flex items-center w-full py-1 px-5 mt-4`
              : "flex items-center w-full py-1 px-5 mt-4"
          }
        >
          <img
            src={iconInventory}
            alt="Icon Dashboard"
            className={`mr-2 ${styles.iconImages}`}
          />
          <p>Inventori</p>
        </NavLink>

        {/* MENU PELANGGAN */}
        <NavLink
          to="/customer"
          className={({ isActive }) =>
            isActive
              ? `${activeLinkClass} flex items-center w-full py-1 px-5 mt-4 mb-4`
              : "flex items-center w-full py-1 px-5 mt-4 mb-4"
          }
        >
          <img
            src={iconCustomer}
            alt="Icon Dashboard"
            className={`mr-2 ${styles.iconImages}`}
          />
          <p>Pelanggan</p>
        </NavLink>

        {/* GARIS PEMBATAS */}
        <div className="border-t border-gray-900 w-full "></div>

        {/* MENU PENJUALAN */}
        <NavLink
          to="/sales"
          className={({ isActive }) =>
            isActive
              ? `${activeLinkClass} flex items-center w-full py-1 px-5 mt-4`
              : "flex items-center w-full py-1 px-5 mt-4"
          }
        >
          <img
            src={iconSelling}
            alt="Icon Dashboard"
            className={`mr-2 ${styles.iconImages}`}
          />
          <p>Penjualan</p>
        </NavLink>

        {/* MENU DISTRIBUSI */}
        <NavLink
          to="/distribution"
          className={({ isActive }) =>
            isActive
              ? `${activeLinkClass} flex items-center w-full py-1 px-5 mt-4 mb-4`
              : "flex items-center w-full py-1 px-5 mt-4 mb-4"
          }
        >
          <img
            src={iconDistribution}
            alt="Icon Dashboard"
            className={`mr-2 ${styles.iconImages}`}
          />
          <p>Distribusi</p>
        </NavLink>

        {/* GARIS PEMBATAS */}
        <div className="border-t border-gray-900 w-full "></div>

        {/* PENGATURAN */}
        <NavLink
          to="/profile/updateProfile"
          className={({ isActive }) =>
            isActive
              ? `${activeLinkClass} flex items-center w-full py-1 px-5 mt-4`
              : "flex items-center w-full py-1 px-5 mt-4"
          }
        >
          <img
            src={iconSetting}
            alt="Icon Dashboard"
            className={`mr-2 ${styles.iconImages}`}
          />
          <p>Pengaturan</p>
        </NavLink>
      </div>
    </>
  );
}

export default Menu;
