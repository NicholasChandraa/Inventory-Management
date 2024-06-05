/* eslint-disable */

import React, { useState, useRef, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import logoNotification from "../../../assets/logoNotification.png";
import { useNavigate } from 'react-router-dom';
import styles from "./notificationIcon.module.css";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ENDPOINT = "http://localhost:5000";

const NotificationIcon = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Dapatkan informasi gudang dari token pengguna
  const token = Cookies.get("Token");
  const decoded = jwtDecode(token);
  const userWarehouseId = decoded.warehouse;

  // Simpan semua notifikasi yang diterima
  const [allNotifications, setAllNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem("notifications");
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  // Notifikasi yang akan ditampilkan pada ikon (maksimal 10)
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Filter notifikasi berdasarkan gudang
    const filteredNotifications = allNotifications.filter(notification => notification.warehouse === userWarehouseId);
    setVisibleNotifications(filteredNotifications.slice(0, 10)); // Ambil hanya 10 notifikasi terbaru untuk ditampilkan
  }, [allNotifications, userWarehouseId]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    const handleNewNotification = (notification) => {
      setAllNotifications(prevNotifications => {
        const newNotification = { ...notification, read: false };
        const updatedNotifications = [newNotification, ...prevNotifications];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });
      toast.info(notification.message);
    };

    // Menangani berbagai jenis notifikasi yang mungkin diterima
    socket.on("newProduct", handleNewNotification);
    socket.on("deleteProduct", handleNewNotification);
    socket.on("addCustomer", handleNewNotification);
    socket.on("updateCustomer", handleNewNotification);
    socket.on("deleteCustomer", handleNewNotification);
    socket.on("addSale", handleNewNotification);
    socket.on("deleteSale", handleNewNotification);
    socket.on("addDistribution", handleNewNotification);
    socket.on("deleteDistribution", handleNewNotification);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = (id) => {
    setAllNotifications(currentNotifications => {
      const updatedNotifications = currentNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      return updatedNotifications;
    });
  };

  const navigateToNotificationDetail = (id) => {
    markAsRead(id);
    navigate(`/notifications?id=${id}`);
  };

  return (
    <div className="relative ml-10 mr-5" ref={notificationRef}>
      <button onMouseEnter={() => setShowNotifications(true)} className="focus:outline-none">
        <img src={logoNotification} className="w-6 h-6" alt="Notifications" />
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl z-10" onMouseLeave={() => setShowNotifications(false)}>
          <div className="p-4">
            {visibleNotifications.length > 0 ? visibleNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => navigateToNotificationDetail(notification.id)}
                className={`cursor-pointer p-2 hover:bg-gray-100 ${styles.hoverNotificationIcon} ${notification.read ? 'text-gray-500' : 'text-black'}`}
              >
                {notification.message}
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    className={`text-blue-500 text-xs block ${styles.buttonMarkAsRead}`}
                  >
                    Tandai
                  </button>
                )}
              </div>
            )) : <div className='w-56'>Tidak Ada Notifikasi.</div>}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default NotificationIcon;




