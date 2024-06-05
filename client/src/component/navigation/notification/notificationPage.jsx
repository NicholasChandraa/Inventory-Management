/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const notificationId = searchParams.get("id");

  // Dapatkan informasi gudang dari token pengguna
  const token = Cookies.get("Token");
  const decoded = jwtDecode(token);
  const userWarehouseId = decoded.warehouse;

  useEffect(() => {
    const savedNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    // Modifikasi: Filter notifikasi berdasarkan gudang
    const filteredNotifications = savedNotifications.filter(notification => notification.warehouse === userWarehouseId);
    setNotifications(filteredNotifications);
  }, [userWarehouseId]);

  const notification = notifications.find((n) => n.id === notificationId);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const handleDeleteNotification = (idToDelete) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== idToDelete,
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    if (idToDelete === notificationId) {
      window.location.href = "/notifications";
    }
  };

  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-1/4 bg-white shadow rounded-lg p-4">
        <h2 className="font-semibold text-lg mb-4">Semua Notifikasi</h2>
        <div className="border-b mb-6"></div>
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-2 ${notif.id === notificationId ? "bg-blue-100 rounded-md" : "hover:bg-gray-100"}`}
            >
              <a
                href={`/notifications?id=${notif.id}`}
                onClick={() => markAsRead(notif.id)}
                className={`${notif.read ? "text-gray-500" : "text-gray-900"} block`}
              >
                {notif.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 bg-white shadow rounded-lg px-6 py-4 ml-4">
        <h1 className="text-lg font-semibold mb-4">Notifikasi Detail</h1>
        <div className="border-b mb-5"></div>
        {notification ? (
          <>
            <div>
              <div className="flex flex-col mb-4">
                <div>
                  <strong>Message</strong>
                </div>
                <div>{notification.message}</div>
              </div>
              
              <div>
                <p
                  className={`mb-2 ${notification.read ? "text-gray-500" : "text-black"}`}
                >
                  <strong>Status :</strong>{" "}
                  {notification.read ? "Dibaca" : "Belum Dibaca"}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDeleteNotification(notification.id)}
              className="mt-4 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 text-sm transition duration-300"
            >
              Hapus
            </button>
            <div className="border-b-2 my-6"></div>
          </>
        ) : (
          <p>No notification found.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
