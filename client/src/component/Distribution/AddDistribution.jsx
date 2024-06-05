/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DistributionNavigation from "./DistributionNavigation";
import { Modal, ModalBody, ModalFooter, Button } from 'flowbite-react';

function AddDistribution() {
  const [form, setForm] = useState({
    nomorDistribusi: "",
    tanggalDistribusi: "",
    namaPenerima: "",
    namaPengirim: "",
    namaDistribusi: "",
    statusVerifikasi: "Tertunda",
    statusPengiriman: "Diproses",
    biayaDistribusi: 0,
    catatan: "",
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();

  const generateDistributionNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = date.toTimeString().split(" ")[0].replace(/:/g, "");
    return `DSTB${dateStr}${timeStr}`;
  };

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      nomorDistribusi: generateDistributionNumber(),
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const token = Cookies.get("Token");
    const decoded = jwtDecode(token);
    const warehouseId = decoded.warehouse;

    const dataToSend = {
      ...form,
      warehouse: warehouseId,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/distribution/add",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        console.log("Distribution Berhasil Ditambahkan:", response.data);
      }

      navigate("/distribution");

    } catch (error) {
      console.error("There was an error submitting the form:", error);
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmationModal(false);
    handleSubmit();
  };

  const openConfirmationModal = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  return (
    <>
      <DistributionNavigation />
      <div className="container w-1/2 shadow-md mx-auto mt-8 m-6 p-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-semibold mt-2 mb-4">
              Tambah Data Distribusi
            </h2>
          </div>
          <Link to={"/distribution"}>
            <button className="bg-white border-2 hover:bg-gray-100 rounded-lg px-3 py-1 text-lg">
              Cancel
            </button>
          </Link>
        </div>
        <div className="border-b-2 my-5"></div>
        <form onSubmit={openConfirmationModal} className="max-w-xl mx-auto">
          <div className="mb-4">
            <label htmlFor="nomorDistribusi" className="block mb-2">
              Nomor Distribusi
            </label>
            <input
              type="text"
              name="nomorDistribusi"
              id="nomorDistribusi"
              value={form.nomorDistribusi}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="namaDistribusi" className="block mb-2">
              Nama Distribusi / Produk
            </label>
            <input
              type="text"
              name="namaDistribusi"
              id="namaDistribusi"
              value={form.namaDistribusi}
              onChange={handleInputChange}
              placeholder="Masukkan Nama Distribusi"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tanggalDistribusi" className="block mb-2">
              Tanggal Distribusi
            </label>
            <input
              type="date"
              name="tanggalDistribusi"
              id="tanggalDistribusi"
              value={form.tanggalDistribusi}
              onChange={handleInputChange}
              placeholder="Masukkan Tanggal Distribusi"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="namaPenerima" className="block mb-2">
              Nama Penerima
            </label>
            <input
              type="text"
              name="namaPenerima"
              id="namaPenerima"
              value={form.namaPenerima}
              onChange={handleInputChange}
              placeholder="Masukkan Nama Penerima"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="namaPengirim" className="block mb-2">
              Nama Pengirim
            </label>
            <input
              type="text"
              name="namaPengirim"
              id="namaPengirim"
              value={form.namaPengirim}
              onChange={handleInputChange}
              placeholder="Masukkan Nama Pengirim"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="biayaDistribusi" className="block mb-2">
              Biaya Distribusi
            </label>
            <input
              type="number"
              name="biayaDistribusi"
              id="biayaDistribusi"
              value={form.biayaDistribusi}
              onChange={handleInputChange}
              placeholder="Masukkan Biaya Distribusi"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="catatan" className="block mb-2">
              Catatan
            </label>
            <textarea
              name="catatan"
              id="catatan"
              value={form.catatan}
              onChange={handleInputChange}
              placeholder="Masukkan Catatan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>

      <Modal show={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}> {/* Modifikasi */}
        <ModalBody>
          <p className="text-lg font-semibold text-center">Yakin ingin menambah data distribusi?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button color="failure" onClick={() => setShowConfirmationModal(false)}>Batal</Button>
          <Button color="success" onClick={handleConfirmSubmit}>Iya</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default AddDistribution;
