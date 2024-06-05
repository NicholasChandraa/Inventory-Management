/* eslint-disable */
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Modal, ModalBody, ModalFooter, Button } from 'flowbite-react';

const ChangePasswordForm = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('Token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;

          const response = await axios.get(`https://inventory-management-api.vercel.app/api/users/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response && response.data) {
            setEmail(response.data.email); // Set email pengguna ke state
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      setError("Email pengguna tidak ditemukan. Tidak dapat melanjutkan.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }
    
    setShowModal(true);
  };

  const handleConfirmChangePassword = async () => {
    setShowModal(false);
    const token = Cookies.get('Token');
    if (!token) {
      setError("Tidak ada token ditemukan. Harap masuk terlebih dahulu.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await axios.post('https://inventory-management-api.vercel.app/api/users/profile/changePassword', {
        userId: userId,
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        // Handle success response
        setPasswords({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setError('');
      }
    } catch (error) {
      // Handle error response
      if (error.response) {
        setError(error.response.data.message || "Terjadi kesalahan saat mengubah password.");
      } else {
        setError("Terjadi kesalahan saat menghubungi server.");
      }
    }
  };

  return (
    <div className="w-1/3 mt-16 flex flex-col items-center mx-auto p-6 rounded-lg shadow">
      <div className='border-b-2 w-full justify-center flex'>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">GANTI PASSWORD</h2>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <input
          type="text"
          name="username"
          value={email}
          autoComplete="username"
          readOnly 
          className="hidden"
        />
        <div className='flex flex-col w-full'>
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Password Lama:</label>
          <input
            id="oldPassword"
            type="password"
            name="oldPassword"
            autoComplete="current-password"
            value={passwords.oldPassword}
            onChange={handleChange}
            required
            className="input-field  rounded-lg mt-3"
          />
        </div>
        <div className='flex flex-col w-full'>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Password Baru:</label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            autoComplete="new-password"
            value={passwords.newPassword}
            onChange={handleChange}
            required
            className="input-field  rounded-lg mt-3"
          />
        </div>
        <div className='flex flex-col w-full'>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru:</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={passwords.confirmPassword}
            onChange={handleChange}
            required
            className="input-field rounded-lg mt-3"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 justify-center flex w-full">Ubah Password</button>
      </form>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalBody>
          <p className="text-lg font-semibold text-center">Yakin ingin mengganti password?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowModal(false)}>Batal</Button>
          <Button color="success" onClick={handleConfirmChangePassword}>Iya</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ChangePasswordForm;