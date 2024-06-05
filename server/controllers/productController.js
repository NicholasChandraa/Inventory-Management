const User = require("../models/User");
const Warehouse = require("../models/Warehouse");
const Product = require("../models/product");
const Category = require("../models/Category");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const InventoryStock = require("../models/InventoryItems");
const socket = require('../socket');

exports.getProductsByWarehouse = async (req, res) => {
  try {
    // Ambil ID gudang dari pengguna yang terotentikasi
    const userWarehouseId = req.user.warehouse;
    // Cari produk berdasarkan ID gudang pengguna
    const products = await Product.find({ warehouse: userWarehouseId })
      .populate("category")
      .populate("warehouse");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addProduct = async (req, res) => {
    const {
        name,
        sku,
        quantity,
        unit,
        purchasePrice,
        sellPrice,
        newCategory,
        warehouse,
        user,
        category: categoryId
    } = req.body;

    try {
        let product = await Product.findOne({ sku, warehouse });

        if (product) {
            let inventoryStock = await InventoryStock.findOne({
                product: product._id,
                warehouse,
            });

            if (!inventoryStock) {
                inventoryStock = new InventoryStock({
                    product: product._id,
                    warehouse,
                    initialQuantity: 0,
                    inQuantity: quantity,
                    createdBy: user,
                    updatedBy: user,
                    status: 'Waiting'
                });
            } else {
                inventoryStock.inQuantity += quantity;
                inventoryStock.statusIn = 'Waiting';
            }
            await inventoryStock.save();

            res.status(200).json({
                message: "Inventory stock updated, awaiting acceptance.",
                product,
                inventoryStock,
            });
        } else {
            let resolvedCategory = categoryId;
            if (newCategory) {
                const category = new Category({
                    name: newCategory,
                    warehouse,
                });
                await category.save();
                resolvedCategory = category._id;
            }

            product = new Product({
                name,
                sku,
                quantity: 0,
                unit,
                purchasePrice,
                sellPrice,
                category: resolvedCategory,
                warehouse,
                user,
            });
            await product.save();

            const inventoryStock = new InventoryStock({
                product: product._id,
                warehouse,
                initialQuantity: 0,
                inQuantity: quantity,
                createdBy: user,
                updatedBy: user,
                status: 'Waiting'
            });
            await inventoryStock.save();

            const io = socket.getIO();
            io.emit('newProduct', {
                message: `Produk baru ${name} telah berhasil ditambahkan.`,
                id: product._id,
                warehouse
            });

            res.status(201).json({
                message: "New product and inventory stock created, awaiting acceptance.",
                product,
                inventoryStock,
            });
        }
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Failed to add product", error: error.message });
    }
};