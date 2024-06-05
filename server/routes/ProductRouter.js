const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/Category");
const Inventory = require("../models/InventoryItems");
const { authMiddleware, adminCheck } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const {
  getProductsByWarehouse,
  addProduct,
} = require("../controllers/productController");

router.get("/", authMiddleware, getProductsByWarehouse);
router.post("/", authMiddleware, addProduct);

// GET all categories
router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const userWarehouseId = req.user.warehouse;
    const categories = await Category.find({ warehouse: userWarehouseId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new Category
router.post("/categories", authMiddleware, async (req, res) => {
  const categoryName = req.body.name;
  const warehouseId = req.user.warehouse;

  try {
    const newCategory = new Category({
      name: categoryName,
      warehouse: warehouseId,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error menambahkan kategori:", error);
    res.status(500).send(error.message);
  }
});

router.delete("/categories/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send("Kategori tidak ditemukan");
    }
    res.status(200).send(`Kategori ${category.name} telah dihapus.`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const product = await Product.findById(userId)
      .populate("category")
      .populate("warehouse");
    if (!product) {
      return res.status(404).json({ message: "Produk Tidak Ditemukan!" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a product by ID
router.put("/:id", async (req, res) => {
  // Destructuring untuk mendapatkan data dari request body
  const {
    name,
    category: categoryName,
    sku,
    quantity,
    unit,
    purchasePrice,
    sellPrice,
    warehouse,
    user
  } = req.body;

  // Validasi ID pengguna
  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ message: "ID pengguna tidak valid" });
  }

  try {
    // Cari produk yang ada menggunakan ID
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Cari atau buat kategori baru berdasarkan nama kategori
    const category = await Category.findOneAndUpdate(
      { name: categoryName, warehouse: warehouse },
      { $setOnInsert: { name: categoryName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Hitung perubahan jumlah stok
    const quantityChange = quantity - existingProduct.quantity;

    // Update informasi produk dan simpan hasilnya dalam variabel `updatedProduct`
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category: category._id, sku, quantity, unit, purchasePrice, sellPrice, warehouse, user },
      { new: true, runValidators: true }
    );

    // Periksa jika ada perubahan jumlah stok
    if (quantityChange !== 0) {
      // Cari atau buat catatan pergerakan stok untuk produk tersebut
      let inventoryStock = await Inventory.findOne({ product: req.params.id });
      if (inventoryStock) {
        // Perbarui catatan stok yang ada
        inventoryStock.inQuantity += quantityChange > 0 ? quantityChange : 0;
        inventoryStock.initialQuantity += quantityChange < 0 ? Math.abs(quantityChange) : 0;
        await inventoryStock.save();
      } else {
        // Jika tidak ada, buat catatan stok baru
        inventoryStock = new Inventory({
          product: req.params.id,
          inQuantity: quantityChange > 0 ? quantityChange : 0,
          initialQuantity: quantityChange < 0 ? Math.abs(quantityChange) : 0,
          createdBy: user,
          warehouse: warehouse
        });
        await inventoryStock.save();
      }
    }

    // Kirim produk yang sudah diupdate sebagai respons
    res.json(updatedProduct);
  } catch (error) {
    // Handle error dan log ke konsol
    console.error("Error updating product:", error);
    res.status(400).json({ message: "Gagal memperbarui produk", details: error.message });
  }
});

// DELETE a product by ID
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produk berhasil dihapus! " });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
