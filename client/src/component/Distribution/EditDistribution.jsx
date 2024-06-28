/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useParams, useNavigate } from "react-router-dom";
import DistributionNavigation from "./DistributionNavigation";
import { Modal, ModalBody, ModalFooter, Button } from "flowbite-react";

function EditDistribution() {
  const [form, setForm] = useState({
    nomorDistribusi: "",
    tanggalDistribusi: "",
    namaDistribusi: "",
    namaPenerima: "",
    namaPengirim: "",
    statusVerifikasi: "",
    statusPengiriman: "",
    biayaDistribusi: 0,
    catatan: "",
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDistributionDetails();
  }, [id]);

  const fetchDistributionDetails = async () => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.get(
        `https://inventory-management-api.vercel.app/api/distribution/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setForm(response.data);
    } catch (error) {
      console.error("Error fetching distribution details: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => {
    const token = Cookies.get("Token");
    try {
      await axios.put(
        `https://inventory-management-api.vercel.app/api/distribution/${id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      navigate("/distribution");
    } catch (error) {
      console.error("There was an error updating the distribution:", error);
    }
    setShowConfirmationModal(false);
  };

  // Form inputs and submit button here...

  return (
    <>
      <DistributionNavigation />
      <div className="container w-1/2 shadow-md mx-auto p-6 m-8">
        <h2 className="text-xl font-semibold mb-4">Edit Distribution</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nomorDistribusi"
              className="block text-sm font-medium text-gray-700"
            >
              No. Distribusi
            </label>
            <input
              type="text"
              name="nomorDistribusi"
              id="nomorDistribusi"
              value={form.nomorDistribusi}
              onChange={handleInputChange}
              readOnly
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="tanggalDistribusi"
              className="block text-sm font-medium text-gray-700"
            >
              Tanggal Distribusi
            </label>
            <input
              type="date"
              name="tanggalDistribusi"
              id="tanggalDistribusi"
              value={form.tanggalDistribusi}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="namaPenerima"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Distribusi
            </label>
            <input
              type="text"
              name="namaDistribusi"
              id="namaDistribusi"
              value={form.namaDistribusi}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="namaPenerima"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Penerima
            </label>
            <input
              type="text"
              name="namaPenerima"
              id="namaPenerima"
              value={form.namaPenerima}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="namaPengirim"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Pengirim
            </label>
            <input
              type="text"
              name="namaPengirim"
              id="namaPengirim"
              value={form.namaPengirim}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="biayaDistribusi"
              className="block text-sm font-medium text-gray-700"
            >
              Biaya Distribusi
            </label>
            <input
              type="number"
              name="biayaDistribusi"
              id="biayaDistribusi"
              value={form.biayaDistribusi}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="catatan"
              className="block text-sm font-medium text-gray-700"
            >
              Catatan
            </label>
            <textarea
              name="catatan"
              id="catatan"
              value={form.catatan}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="statusVerifikasi"
              className="block text-sm font-medium text-gray-700"
            >
              Status Verifikasi
            </label>
            <select
              name="statusVerifikasi"
              id="statusVerifikasi"
              value={form.statusVerifikasi}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="Tertunda">Tertunda</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
              <option value="Dalam Proses">Dalam Proses</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="statusPengiriman"
              className="block text-sm font-medium text-gray-700"
            >
              Status Pengiriman
            </label>
            <select
              name="statusPengiriman"
              id="statusPengiriman"
              value={form.statusPengiriman}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="Diproses">Diproses</option>
              <option value="Dikirim">Dikirim</option>
              <option value="Tiba di Tujuan">Tiba di Tujuan</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          {/* Submit button */}
          <div className="flex justify-between">
            <Link to={"/distribution"}>
              <button className="px-4 py-2 mr-4 bg-red-500 text-white rounded-md hover:bg-blue-700 transition duration-300">
                Batal
              </button>
            </Link>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Update Distribusi
            </button>
          </div>
        </form>
      </div>

      <Modal
        show={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
      >
        {" "}
        {/* Modifikasi */}
        <ModalBody>
          <p className="text-lg font-semibold text-center">
            Yakin ingin mengedit atau ubah?
          </p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            color="failure"
            onClick={() => setShowConfirmationModal(false)}
          >
            Batal
          </Button>
          <Button color="success" onClick={handleConfirmSubmit}>
            Iya
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default EditDistribution;
