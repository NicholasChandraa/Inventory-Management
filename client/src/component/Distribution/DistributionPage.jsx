/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import DistributionNavigation from "./DistributionNavigation";
import { jwtDecode } from "jwt-decode";
import { Modal, ModalBody, ModalFooter, Button } from "flowbite-react";

function DistributionPage() {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); //Modal untuk hapus
  const [distributionToDelete, setDistributionToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        const token = Cookies.get("Token");
        const decoded = jwtDecode(token);
        const warehouseId = decoded.warehouse;

        const response = await axios.get(
          "https://inventory-management-api.vercel.app/api/distribution",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { warehouse: warehouseId },
          },
        );

        setDistributions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching distributions:", error);
        setLoading(false);
      }
    };

    fetchDistributions();
  }, []);

  const editDistribution = (id) => {
    navigate(`/distribution/distributionPage/editDistribution/${id}`);
  };

  const confirmDeleteDistribution = (id) => {
    setDistributionToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    if (distributionToDelete) {
      try {
        const token = Cookies.get("Token");
        await axios.delete(`https://inventory-management-api.vercel.app/api/distribution/${distributionToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDistributions(
          distributions.filter((distribution) => distribution._id !== distributionToDelete),
        );
        setShowConfirmationModal(false);
      } catch (error) {
        console.error("There was an error deleting the distribution:", error);
        setShowConfirmationModal(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DistributionNavigation />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">DAFTAR DISTRIBUSI</h1>
        <div className="my-6 border-b-2"></div>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  No. Distribusi
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  Tanggal Distribusi
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  Nama Distribusi
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  Nama Penerima
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  Nama Pengirim
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  Status Pengiriman
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  Biaya Distribusi
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  Catatan
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  Status Verifikasi
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 bg-gray-800 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((distro, index) => (
                <tr className="bg-white border-b" key={index}>
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {distro.nomorDistribusi}
                  </th>
                  <td className="py-4 px-6">
                    {new Date(distro.tanggalDistribusi).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">{distro.namaDistribusi}</td>
                  <td className="py-4 px-6">{distro.namaPenerima}</td>
                  <td className="py-4 px-6">{distro.namaPengirim}</td>
                  <td className="py-4 px-6">{distro.statusPengiriman}</td>
                  <td className="py-4 px-6">{distro.biayaDistribusi}</td>
                  <td className="py-4 px-6">{distro.catatan}</td>
                  <td className="py-4 px-6">{distro.statusVerifikasi}</td>
                  <td className="py-4 px-6 flex flex-col justify-center items-center">
                    <button
                      onClick={() => editDistribution(distro._id)}
                      className="text-white w-full py-1 px-3 rounded-lg bg-blue-500 hover:bg-blue-700 mb-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteDistribution(distro._id)}
                      className="text-white w-full py-1 px-3 rounded-lg bg-red-500 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Link
            to="/distribution/distributionPage/addDistribution/*"
            className="bg-green-500 text-white hover:bg-green-600 text-lg px-2 py-2 font-bold rounded-md"
          >
            + Tambah
          </Link>
        </div>
      </div>

      <Modal
        show={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
      >
        {" "}
        {/* Modifikasi */}
        <ModalBody>
          <p className="text-lg font-semibold text-center">
            Yakin ingin menghapus?
          </p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            color="failure"
            onClick={() => setShowConfirmationModal(false)}
          >
            Batal
          </Button>
          <Button color="success" onClick={handleConfirmDelete}>
            Iya
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default DistributionPage;
