const Distribution = require("../models/Distribution");
const Warehouse = require("../models/Warehouse");
const mongoose = require("mongoose");
const socket = require('../socket');

exports.getDistributions = async (req, res) => {
    const warehouse  = req.user.warehouse;
    
    try {
      const distributions = await Distribution.find({
        warehouse: warehouse
      }).populate("warehouse");
  
      res.json(distributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addDistribution = async (req, res) => {
    const {
        nomorDistribusi,
        tanggalDistribusi,
        namaPenerima,
        namaPengirim,
        namaDistribusi,
        statusVerifikasi,
        statusPengiriman,
        biayaDistribusi,
        catatan,
      } = req.body;
    
      const warehouseId = req.user.warehouse;
    
      try {
        const newDistribution = new Distribution({
          nomorDistribusi,
          tanggalDistribusi,
          namaPenerima,
          namaPengirim,
          namaDistribusi,
          statusVerifikasi,
          statusPengiriman,
          biayaDistribusi,
          catatan,
          warehouse: warehouseId,
        });
    
        await newDistribution.save();

        const io = socket.getIO();
        io.emit('addDistribution', { message: `Distribusi berhasil ditambahkan dengan No. Pesanan : ${nomorDistribusi} dan Penerima : ${namaPenerima}.`, id: newDistribution.id, warehouse: warehouseId });
    
        res.status(201).json(newDistribution);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


  exports.updateDistribution = async (req, res) => {
    const { id } = req.params;
    try {
      const distribution = await Distribution.findById(id);
    if (!distribution) {
      return res.status(404).json({ message: "Distribution not found" });
    }

    const previousStatus = distribution.statusVerifikasi;
    Object.assign(distribution, req.body);

    // Jika status diubah menjadi "Disetujui", baru masukkan biaya distribusi
    if (previousStatus !== "Disetujui" && distribution.statusVerifikasi === "Disetujui") {
      distribution.biayaDistribusi = req.body.biayaDistribusi || distribution.biayaDistribusi;
    }

    await distribution.save();

    res.status(200).json(distribution);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete a distribution
  exports.deleteDistribution = async (req, res) => {
    const { id } = req.params;
    try {
      const distributionToDelete = await Distribution.findByIdAndDelete(id);
      if (!distributionToDelete) {
        return res.status(404).json({ message: "Distribution not found" });
      }

      const io = socket.getIO();
      io.emit('deleteDistribution', { message: `Distribusi berhasil dihapus dengan No. Pesanan : ${distributionToDelete.nomorDistribusi} dan Penerima : ${distributionToDelete.namaPenerima}.`, id: id, warehouse: distributionToDelete.warehouse });

      res.status(200).json({ message: "Distribution deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getOneDistribution = async (req, res) => {
    try {
        const { id } = req.params;
        const distribution = await Distribution.findById(id).populate('warehouse');
    
        if (!distribution) {
          return res.status(404).json({ message: 'Distribution not found' });
        }
    
        res.status(200).json(distribution);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
  }