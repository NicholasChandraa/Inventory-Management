/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useProfileImage } from "../../context/ProfileImageContext";
import ChangePasswordForm from "./ChangePasswordForm";
import { Modal, ModalBody, ModalFooter, Button } from "flowbite-react";
import fotoprofile from "../../assets/profileDefault.jpg";

function UserProfile(props) {
  const [userData, setUserData] = useState({
    name: "",
    noHandphone: "",
    gender: "",
    dob: "",
  });

  const [role, setRole] = useState("");
  const { profileImageUrl, updateProfileImage } = useProfileImage();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedProfilePic = localStorage.getItem("profilePicture");
    if (savedProfilePic) {
      updateProfileImage(
        `https://inventory-management-api.vercel.app${savedProfilePic}`,
      );
    }

    const token = Cookies.get("Token");
    const decoded = jwtDecode(token);
    const role = decoded.role;
    setRole(role);

    const fetchUserData = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("No User ID! Sisi Client");
        return;
      }

      const userToken = Cookies.get("Token");
      if (!userToken) {
        console.error("No user token found");
        return;
      }

      try {
        const response = await axios.get(
          `https://inventory-management-api.vercel.app/api/users/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          },
        );

        if (response && response.data) {
          setUserData({
            name: response.data.name,
            noHandphone: response.data.noHandphone,
            gender: response.data.gender,
            dob: response.data.dob,
            ...response.data,
          });
        } else {
          console.error("No data in response", response);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fungsi untuk mendapatkan user ID dari token JWT
  function getUserIdFromToken() {
    const token = Cookies.get("Token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.id;
    }
    return null;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleConfirmUpdateProfile = async () => {
    setShowModal(false);

    const userId = getUserIdFromToken();
    if (!userId) {
      console.error("No user ID! sisi Client");
      return;
    }

    const userToken = Cookies.get("Token");
    if (!userToken) {
      console.error("No user token found");
      return;
    }

    try {
      const response = await axios.post(
        `https://inventory-management-api.vercel.app/api/users/profile/updateProfile/${userId}`,
        userData,
        { headers: { Authorization: `Bearer ${userToken}` } },
      );

      if (response && response.data) {
      } else {
        console.error("No data in response", response);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response) {
        console.error("Data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  // UNTUK FUNGSI UPLOAD GAMBAR
  const onUploadSuccess = async (filePath) => {
    const userId = getUserIdFromToken();
    const userToken = Cookies.get("Token");

    try {
      await axios.post(
        "https://inventory-management-api.vercel.app/api/users/profile/saveProfilePicturePath",
        {
          userId,
          profilePicture: filePath,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      const newProfilePicUrl = `https://inventory-management-api.vercel.app${filePath}`;
      localStorage.setItem("profilePicture", filePath);
      updateProfileImage(newProfilePicUrl); // Memperbarui URL gambar profil di Context
      console.log("Profile picture path updated successfully");
    } catch (error) {
      console.error("Error saving profile picture: ", error);
    }
  };

  const handleUpdateProfilePicture = async (filePath) => {
    const userId = getUserIdFromToken();
    const userToken = Cookies.get("Token");

    try {
      await axios.post(
        "https://inventory-management-api.vercel.app/api/users/profile/updateProfilePicture",
        { userId, filePath },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      // Perbarui gambar profil di konteks/state/toko global
      updateProfileImage(
        `https://inventory-management-api.vercel.app${filePath}`,
      );
    } catch (error) {
      console.error("Kesalahan saat memperbarui gambar profil:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col items-center justify-center bg-blue-500 p-4 rounded-t-lg mb-4">
          <img
            className="w-20 h-20 rounded-full"
            src={profileImageUrl || fotoprofile}
            alt="Profile Picture"
          />
          <h2 className="text-xl font-semibold text-white mt-2">
            {userData.name}
          </h2>
          <p className="text-white">{userData.email}</p>
        </div>
        <ProfilePictureUpload
          onUploadSuccess={onUploadSuccess}
          updateProfilePicture={handleUpdateProfilePicture}
        />
        <form action="" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Nama
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={userData.name || ""}
              onChange={handleInputChange}
              placeholder="Nama"
            />

            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Role
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder={role}
              disabled
            />

            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="noHandphone"
            >
              Handphone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="noHandphone"
              type="text"
              name="noHandphone"
              value={userData.noHandphone || ""}
              onChange={handleInputChange}
              placeholder="Nomor Handphone"
            />

            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="gender"
            >
              Gender
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="gender"
              type="text"
              name="gender"
              value={userData.gender || ""}
              onChange={handleInputChange}
              placeholder="Gender"
            />

            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="dob"
            >
              Tanggal Lahir
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="dob"
              type="text"
              name="dob"
              value={userData.dob || ""}
              onChange={handleInputChange}
              placeholder="Tanggal Lahir"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Link
              to={"/profile/changePassword"}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Ganti Password
            </Link>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalBody>
          <p className="text-lg font-semibold text-center">
            Yakin ingin mengubah profile?
          </p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button color="success" onClick={handleConfirmUpdateProfile}>
            Iya
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default UserProfile;
