const express = require("express");
const router = express.Router();
const Distribution = require("../models/Distribution");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/product");
const InventoryItem = require("../models/InventoryItems");
const Warehouse = require("../models/Warehouse");
const Customer = require("../models/Customer");
const CustomerType = require("../models/CustomerType");
const Sale = require("../models/Sales");
const mongoose = require("mongoose");
const { authMiddleware, adminCheck } = require("../middleware/authMiddleware");

router.get("/revenue", authMiddleware, async (req, res) => {
  const warehouseId = req.user.warehouse; // ambil dari user session atau auth context
  const totalRevenue = await Sale.aggregate([
    { $match: { warehouse: new mongoose.Types.ObjectId(warehouseId), statusSale: "Accepted" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  res.json(totalRevenue);
});

// API endpoint untuk mengambil total pengeluaran
router.get("/expenses", authMiddleware, async (req, res) => {
  const warehouseId = req.user.warehouse;
  const totalExpenses = await Distribution.aggregate([
    { $match: { warehouse: new mongoose.Types.ObjectId(warehouseId), statusVerifikasi: "Disetujui" } },
    { $group: { _id: null, total: { $sum: "$biayaDistribusi" } } },
  ]);
  res.json(totalExpenses);
});

router.get("/stats", authMiddleware, async (req, res) => {
  const warehouseId = req.user.warehouse;
  try {
    // Aggregate Sales data
    const salesData = await Sale.aggregate([
      { $match: { warehouse: new mongoose.Types.ObjectId(warehouseId), statusSale: "Accepted" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Aggregate Distribution data
    const distributionData = await Distribution.aggregate([
      { $match: { warehouse: new mongoose.Types.ObjectId(warehouseId), statusVerifikasi: "Disetujui" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalExpenses: { $sum: "$biayaDistribusi" },
        },
      },
    ]);

    // Combine both data sets by date
    const combinedData = {}; // Use an object for easy access by date keys
    salesData.forEach((sale) => {
      combinedData[sale._id] = {
        ...combinedData[sale._id],
        totalSales: sale.totalSales,
      };
    });
    distributionData.forEach((dist) => {
      combinedData[dist._id] = {
        ...combinedData[dist._id],
        totalExpenses: dist.totalExpenses,
      };
    });

    // Convert combinedData to array suitable for charting
    const statsData = Object.keys(combinedData).map((date) => ({
      date,
      totalSales: combinedData[date].totalSales || 0,
      totalExpenses: combinedData[date].totalExpenses || 0,
      profit:
        (combinedData[date].totalSales || 0) -
        (combinedData[date].totalExpenses || 0),
    }));

    res.json(statsData);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/price-comparison", authMiddleware, async (req, res) => {
  const warehouseId = req.user.warehouse;
  try {
    const sales = await Sale.find({ warehouse: warehouseId })
      .populate({
        path: "items.product",
        select: "purchasePrice sellPrice _id",
      })
      .lean(); // Menggunakan lean() untuk performa yang lebih baik

    let totalPurchasePrice = 0;
    let totalSellPrice = 0;

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!item.product) {
          console.error(`Informasi produk hilang dengan id ${item._id} dan di penjualan Id nya adalah ${sale._id}`);
          return; // Skip item jika tidak ada produk
        }
    
        const purchasePrice = item.product.purchasePrice * item.quantity;
        const sellPrice = item.product.sellPrice * item.quantity;

        totalPurchasePrice += purchasePrice;
        totalSellPrice += sellPrice;
      });
    });

    const profit = totalSellPrice - totalPurchasePrice;

    res.json({
      totalPurchasePrice,
      totalSellPrice,
      profit,
    });
  } catch (error) {
    console.error("Error getting price comparison:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/sales-stats", authMiddleware, async (req, res) => {
  const warehouseId = req.user.warehouse;
  try {
    const salesStats = await Sale.aggregate([
      { $match: { statusSale: "Accepted", warehouse: new mongoose.Types.ObjectId(warehouseId) } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalAmount: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, //sort berdasarkan tanggal
    ]);
    res.json(salesStats);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/distribution-stats", authMiddleware, async (req, res) => {
  const warehouseId = req.user.warehouse;
  try {
    const distributionStats = await Distribution.aggregate([
      { $match: { warehouse: new mongoose.Types.ObjectId(warehouseId) } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalCost: { $sum: "$biayaDistribusi" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort berdasarkan tanggal ascending
    ]);
    res.json(distributionStats);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
