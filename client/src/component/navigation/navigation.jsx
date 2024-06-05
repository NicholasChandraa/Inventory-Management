/* eslint-disable */
import React, { useState, useEffect, Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

import logo from "../../assets/logo-web.png";
import dropdownGudang from "../../assets/dropdownGudang.png";
import logoNotification from "../../assets/logoNotification.png";
// import profilePicture from "../../assets/pp.jpg"; // This line is commented out in the original code
import NotificationIcon from "./notification/notificationIcon";
import NotificationPage from "./notification/notificationPage";
import profilePlaceholder from "../../assets/pp.jpg";
import Login from "../Login/Login";
import { useProfileImage } from "../../context/ProfileImageContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navigation() {
  const navigate = useNavigate();
  const token = Cookies.get('Token');
  const [warehouses, setWarehouses] = useState('');
  const [warehousesLocation, setWarehousesLocation] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const { profileImageUrl } = useProfileImage();

  useEffect(() => {

    const savedProfilePic = localStorage.getItem('profilePicture');
    if(savedProfilePic){
      setProfilePictureUrl(`http://localhost:5000${savedProfilePic}`);
    }

    const fetchUserProfile = async () => {
      const userId = getUserIdFromToken();
      if(!userId) {
        console.log("User ID not found");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/profile?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWarehouses(response.data.warehouse.name);
        setWarehousesLocation(response.data.warehouse.location);

      } catch (error) {
        console.error("Failed to fetch user profile: ", error);
      }
    }

    fetchUserProfile();
  }, [token]);

  function getUserIdFromToken() {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Decoding token failed", error);
      return null;
    }
  }

  return (
    <>
      <div className="flex justify-between shadow h-24 w-full">
        <div className="mt-2 mb-2 ml-8 flex items-center">
          <Link to="/dashboard">
            <img className="inline-block w-32 pr-5 border-gray-300" src={logo} alt="Logo Polytech Indo Hausen" />
          </Link>
          <div className="w-px bg-gray-400 h-14 mx-6"></div>
          <span className="inline-block font-bold ml-6 w-20 leading-5">
            INVENTORY MANAGEMENT
          </span>
        </div>

        {token ? (
          <div className="flex mr-5 items-center">
            <div className="relative font-semibold py-2 px-2">
              {warehouses} - {warehousesLocation}
            </div>

            <div className="w-px bg-gray-400 h-10 ml-10"></div>
            
            <div className="flex justify-end p-0">
              <NotificationIcon />
            </div>

            <Menu as="div" className="ml-4 relative">
              <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300">
                <span className="sr-only">Open user menu</span>
                <img className="w-14 h-14 rounded-full" src={profileImageUrl || profilePictureUrl} alt="Profile Picture" />
                <ChevronDownIcon className="w-4 ml-2 my-auto" aria-hidden="true" />
              </Menu.Button>
              <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a href="/profile/updateProfile" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                        Pengaturan
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/Login" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")} onClick={() => { Cookies.remove("Token"); }}>
                        Keluar
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ) : (
          <Link to="/Login" className="inline-flex items-center h-12 my-auto mr-12 px-5 py-1 border-2 border-gray-400 text-sm font-medium rounded-xl text-black bg-white hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out">
            Login
          </Link>
        )}
      </div>
    </>
  );
}

export default Navigation;
