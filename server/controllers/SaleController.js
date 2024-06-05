const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/product");
const InventoryItem = require("../models/InventoryItems");
const Warehouse = require("../models/Warehouse");
const Customer = require("../models/Customer");
const CustomerType = require("../models/CustomerType");
const Sale = require("../models/Sales");
const mongoose = require("mongoose");
const socket = require("../socket");

exports.getAllSales = async (req, res) => {
  const warehouseId = req.user.warehouse; // From user session or context

  try {
    const query = { warehouse: warehouseId };
    // Temukan semua sales yang terkait dengan warehouseId dan populasi field yang dibutuhkan

    const sales = await Sale.find(query)
      .populate("customer", "name address customerType")
      .populate("customerType", "name _id")
      .populate({
        path: "items.product", // Populate only name and price from product
      })
      .populate({
        path: "items.inventory", // Assuming you want to populate details from InventoryStock
      })
      .exec();

    // Kirim response dengan sales data
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOneSale = async (req, res) => {
  const { id } = req.params; // Mengambil ID sale dari parameter URL

  try {
    // Temukan satu sale dengan ID yang diberikan dan populasi field yang dibutuhkan
    const sale = await Sale.findById(id)
      .populate("customer", "name address customerType")
      .populate("customerType", "name")
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "Product",
        },
      })
      .populate("warehouse", "name")
      .exec();

    if (!sale) {
      // Jika sale tidak ditemukan, kirim status 404 Not Found
      return res.status(404).json({ message: "Sale not found." });
    }

    // Kirim response dengan detail sale
    res.status(200).json(sale);
  } catch (error) {
    // Jika ada kesalahan dalam pengambilan data, kirim status 500 Internal Server Error
    console.error("Error fetching sale:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.addSale = async (req, res) => {
  console.log(req.body);

  const {
    orderNumber,
    warehouse,
    items,
    saleDate,
    customer,
    customerType,
    address,
    totalAmount,
    remainingAmount,
    paymentReceived,
    paymentStatus,
    deliveryStatus,
    statusSale,
  } = req.body;

  try {
    const newSale = new Sale({
      orderNumber,
      warehouse,
      items,
      saleDate,
      customer,
      customerType,
      address,
      totalAmount,
      remainingAmount,
      paymentReceived,
      paymentStatus,
      deliveryStatus,
      statusSale,
    });

    const savedSale = await newSale.save();

    const io = socket.getIO();
    io.emit("addSale", {
      message: `Penjualan berhasil ditambahkan dengan No. Pesanan : ${orderNumber}.`,
      id: newSale._id,
      warehouse
    });

    // Tidak memperbarui stok saat penjualan pertama kali ditambahkan
    res.status(201).json({
      message: "Sale successfully added!",
      sale: savedSale,
    });
  } catch (error) {
    console.error("Error adding sale:", error);
    res.status(500).json({ message: error.message });
  }
};



exports.updateSale = async (req, res) => {
  const { id } = req.params;
  const { noteSale, statusSale, paymentReceived, paymentStatus, deliveryStatus } = req.body;
  console.log(req.body);

  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const previousStatus = sale.statusSale;
    sale.noteSale = noteSale !== undefined ? noteSale : sale.noteSale;
    sale.statusSale = statusSale !== undefined ? statusSale : sale.statusSale;
    sale.paymentReceived = paymentReceived !== undefined ? paymentReceived : sale.paymentReceived;
    sale.paymentStatus = paymentStatus !== undefined ? paymentStatus : sale.paymentStatus;
    sale.deliveryStatus = deliveryStatus !== undefined ? deliveryStatus : sale.deliveryStatus;

    
    // Jika status diubah menjadi "Rejected", setel totalAmount, paymentReceived, dan remainingAmount menjadi 0
    if (statusSale === 'Rejected') {
      sale.totalAmount = 0;
      sale.paymentReceived = 0;
      sale.remainingAmount = 0;
    } else {
      sale.remainingAmount = sale.totalAmount - sale.paymentReceived;
    }

    await sale.save();

    // Perbarui stok hanya jika status berubah dari non-Accepted ke Accepted
    if (previousStatus !== 'Accepted' && statusSale === 'Accepted') {
      for (const item of sale.items) {
        const inventoryItem = await InventoryItem.findOne({
          product: item.product,
          warehouse: sale.warehouse,
        });

        const produk = await InventoryItem.findOne({
          product: item.product,
          warehouse: sale.warehouse,
        }).populate("product");

        if (inventoryItem) {
          if (inventoryItem.initialQuantity >= item.quantity) {
            inventoryItem.finalQuantity =
              inventoryItem.initialQuantity + inventoryItem.inQuantity - inventoryItem.saleQuantity;
            await inventoryItem.save();
          } else {
            sale.statusSale = statusSale !== undefined ? "Waiting" : sale.statusSale;
            await sale.save();
            throw new Error(`Jumlah Stok tidak mencukupi untuk dijual ${produk.product.name}`);
          }
        } else {
          throw new Error(`item tidak ditemukan untuk product ${item.product}`);
        }
      }
    }

    res.status(200).json({
      message: "Sale successfully updated",
      sale,
    });
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.deleteSale = async (req, res) => {
  const { id } = req.params; // Mengambil ID sale dari parameter URL

  try {
    // Mencari dan menghapus sale berdasarkan ID
    const deletedSale = await Sale.findByIdAndDelete(id).populate("customer");

    console.log(deletedSale);

    if (!deletedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const io = socket.getIO();
    io.emit("deleteSale", {
      message: `Penjualan berhasil dihapus dengan No. Pesanan : ${deletedSale.orderNumber} dan Pelanggan: ${deletedSale.customer.name}.`,
      id: id, warehouse: deletedSale.warehouse
    });

    res.status(200).json({ message: "Sale successfully deleted" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ message: error.message });
  }
};
