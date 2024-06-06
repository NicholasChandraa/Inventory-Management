/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { Modal, Button } from 'antd';

function ProfilePictureUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const token = Cookies.get("Token");

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if(!selectedFile) {
      console.error("Tidak ada file yang dipilih.");
      return; 
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await axios.post('https://inventory-management-api.vercel.app/api/users/profile/uploadImage', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.filePath) {
        onUploadSuccess(response.data.filePath);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Gagal mengupload gambar:', error);
    }
  };


  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleUpload}>Unggah Gambar</button>
      <Modal
  title="Unggah Berhasil"
  open={isModalOpen}
  onOk={handleOk}
  okText="OK"
  cancelText="Batal"
  closable={false}
  okButtonProps={{
    style: {
      backgroundColor: '#1890ff', // Warna biru Ant Design
      color: 'white',
      borderColor: '#1890ff'
    }
  }}
  cancelButtonProps={{
    style: { display: 'none' } // Sembunyikan tombol batal jika tidak diperlukan
  }}
>
  <p>Gambar berhasil diunggah!</p>
</Modal>
    </div>
  );
}

export default ProfilePictureUpload;

