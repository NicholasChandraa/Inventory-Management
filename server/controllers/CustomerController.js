const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/product");
const Inventory = require("../models/InventoryItems");
const Warehouse = require("../models/Warehouse");
const Customer = require("../models/Customer");
const CustomerType = require("../models/CustomerType");
const mongoose = require("mongoose");
const socket = require('../socket');

exports.getAllCustomers = async (req, res) => {
  const warehouseId = req.user.warehouse;

  try {
    const customers = await Customer.find({ warehouse: warehouseId }).populate(
      "customerType"
    );
    res.status(200).json(
      customers.map((customer) => ({
        ...customer.toObject(),
        customerType: customer.customerType
          ? { id: customer.customerType._id, name: customer.customerType.name }
          : "Tipe Customer Tidak Ditemukan",
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dapetin 1 data pelanggan
exports.getOneCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate("customerType")
      .populate("warehouse", "name");
    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    res.json({
      ...customer.toObject(),
      customerType: customer.customerType
        ? customer.customerType.name
        : "Tipe Customer Tidak Ditemukan"
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.addCustomer = async (req, res) => {
  const { name, email, phone, address, customerType, warehouse } = req.body;
  try {
    let customerTypeRecord;

    // Jika customerType adalah ID yang valid, gunakan untuk mencari record.
    if (mongoose.isValidObjectId(customerType)) {
      customerTypeRecord = await CustomerType.findById(customerType);
      if (!customerTypeRecord) {
        return res
          .status(404)
          .json({ message: "Tipe pelanggan tidak ditemukan." });
      }
    } else if (customerType.trim() !== "") {
      // Jika bukan ID, anggap ini sebagai nama baru dan buat record baru.
      customerTypeRecord = new CustomerType({ name: customerType, warehouse });
      await customerTypeRecord.save();
    } else {
      // Jika customerType kosong, kirim pesan error.
      return res
        .status(400)
        .json({ message: "Nama tipe pelanggan harus diisi." });
    }

    // Cek apakah pelanggan dengan email yang sama sudah ada di gudang yang sama
    const existingCustomer = await Customer.findOne({ email, warehouse });
    if (existingCustomer) {
      return res.status(400).json({ message: "Pelanggan dengan email ini sudah ada di gudang ini." });
    }

    // Membuat customer baru dengan tipe pelanggan yang telah ditemukan atau dibuat.
    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      customerType: customerTypeRecord._id,
      warehouse,
    });

    await newCustomer.save();

    const io = socket.getIO();
    io.emit('addCustomer', { message: `Pelanggan telah ditambahkan Dengan Nama: ${name} dan Email : ${email}.`, id: newCustomer._id, warehouse});

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error in addCustomers:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, customerType, newCustomerType } = req.body;
  const warehouseId = req.user.warehouse;

  console.log("Received update request for customer:", id);
  console.log("Request body:", req.body);

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found in database." });
    }

    let customerTypeRecord;
    if (newCustomerType) {
      customerTypeRecord = await CustomerType.findOneAndUpdate(
        { name: newCustomerType, warehouse: warehouseId },
        { $setOnInsert: { warehouse: warehouseId } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } 
    
    else if (customerType && mongoose.isValidObjectId(customerType)) {
      customerTypeRecord = await CustomerType.findById(customerType);
      if (!customerTypeRecord) {
        return res.status(404).json({ message: "Tipe pelanggan tidak ditemukan." });
      }
    } else {
      console.log("Invalid Customer Type", customerTypeRecord);
      return res.status(400).json({ message: "Invalid customer type." });
    }

    console.log("Customer Type Record:", customerTypeRecord);
    if (!customerTypeRecord) {
      return res.status(404).json({ message: "Tipe pelanggan tidak ditemukan atau salah." });
    }

    const update = {
      name,
      email,
      phone,
      address,
      customerType: customerTypeRecord._id,
    };

    console.log("Updating customer with data:", update);

    const updatedCustomer = await Customer.findByIdAndUpdate(id, update, { new: true }).populate("customerType", "name");

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan." });
    }

    const io = socket.getIO();
    io.emit('updateCustomer', { message: `Edit Pelanggan telah berhasil dilakukan Dengan Nama : ${name} dan Email : ${email}.`, id: id, warehouse: warehouseId});

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};


// Hapus Pelanggan
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan." });
    }

    console.log(customer);

    const io = socket.getIO();
    io.emit('deleteCustomer', { message: `Hapus Pelanggan telah berhasil dilakukan Dengan Nama : ${customer.name} dan ID Pelanggan : ${id}.`, id: id, warehouse: customer.warehouse});

    res.status(200).json({ message: "Pelanggan berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// dapetin semua tipe pelanggan
exports.getCustomerTypes = async (req, res) => {
  const warehouseId = req.user.warehouse;
  try {
    const types = await CustomerType.find({ warehouse: warehouseId });
    res.status(200).json(types);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// tambah tipe pelanggan
exports.addCustomerType = async (req, res) => {
  try {
    const { name, warehouse } = req.body;
    if (!name || !warehouse) {
      return res
        .status(400)
        .json({ message: "Data yang diperlukan tidak lengkap." });
    }

    const newType = new CustomerType({ name, warehouse });
    await newType.save();
    res.status(201).json(newType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCustomerType = async (req, res) => {
  const warehouseId = req.user.warehouse;
  const { id } = req.params;

  try {
    await Customer.deleteMany({ customerType: id, warehouse: warehouseId });

    const customerType = await CustomerType.findOneAndDelete({
      _id: id,
      warehouse: warehouseId
    });

    if (!customerType) {
      return res
        .status(404)
        .json({ message: "Tipe pelanggan tidak ditemukan" });
    }

    res.status(200).json({ message: "Tipe Pelangggan berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting customer type:", error);
    res.status(500).json({ message: error.message });
  }
};
