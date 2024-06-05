const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/product");
const Inventory = require("../models/InventoryItems");
const Warehouse = require("../models/Warehouse");
const Sale = require('../models/Sales');
const socket = require('../socket');

// Get All Inventory Stock
exports.getInventoryStock = async (req, res) => {
  try {
    let query = { warehouse: req.user.warehouse };

    if (req.query.date) {
      const startDate = new Date(req.query.date);
      startDate.setHours(0, 0, 0, 0); // Set awal hari
      const endDate = new Date(req.query.date);
      endDate.setHours(23, 59, 59, 999); // Set akhir hari
      query.updatedAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (req.query.statusIn) {
      query.statusIn = req.query.statusIn;
    }

    if (req.query.statusSale) {
      query.statusSale = req.query.statusSale;
    }

    if (req.query.updatedBy) {
      // memakai regex untuk mencari user yang 'include' nama tertentu
      const users = await User.find({ 
        email: { $regex: req.query.updatedBy, $options: "i" } // "i" adalah case-insensitive
      }).select('_id'); // Ambil ID user untuk query berikutnya

      const userIds = users.map(user => user._id);
      query.updatedBy = { $in: userIds };
    }

    const InventoryMovement = await Inventory.find(query)
      .populate("product")
      .populate("warehouse")
      .populate("createdBy")
      .populate("updatedBy");

    res.json(InventoryMovement);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get One Inventory Stock
exports.getProductInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find({
      product: req.params.productId
    })
      .populate("product")
      .populate("createdBy");

    res.json(inventoryItems);
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error fetching inventory berdasarkan product ID ",
        error: error.message,
      });
  }
};

// Create Inventory Stock
exports.addInventoryStock = async (req, res) => {
  try {
    const newIntentoryMovement = new Inventory(req.body);
    const savedInventoryMovement = await newIntentoryMovement.save();
    res.status(201).json(savedInventoryMovement);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateInventoryStock = async (req, res) => {
  const { noteIn, statusIn } = req.body;
  const { id } = req.params;

  try {
    const inventoryItem = await Inventory.findById(id).populate('product');

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Pastikan hanya mengubah stok ketika status berubah dari non-Accepted ke Accepted
    if (inventoryItem.statusIn !== 'Accepted' && statusIn === 'Accepted') {
      // Perbarui stok produk
      const product = await Product.findById(inventoryItem.product._id);
      if (product && inventoryItem.inQuantity > 0) {
        product.quantity += inventoryItem.inQuantity;
        await product.save();

        // Update stok inventaris
        inventoryItem.initialQuantity += inventoryItem.inQuantity;
        inventoryItem.inQuantity = 0;
      }
      inventoryItem.statusIn = statusIn;
    }

    // handling ketika statusnya 'Rejected' maka diubah ke 0
    if (statusIn === 'Rejected') {
      inventoryItem.inQuantity = 0;
    }

    inventoryItem.statusIn = statusIn;
    inventoryItem.noteIn = noteIn; // Update catatan terkini
    await inventoryItem.save();

    res.json({
      message: "Inventory stock updated successfully",
      inventory: inventoryItem
    });

  } catch (error) {
    console.error("Error updating inventory stock:", error);
    res.status(500).json({
      message: "Error updating inventory stock",
      error: error.message
    });
  }
};



exports.deleteInventoryStock = async (req, res) => {

  try {
    const inventoryItem = await Inventory.findById(req.params.id)
    .populate("product")

    if (!inventoryItem) {
      console.log("Inventory tidak ketemu dengan ID:", req.params.id);
      return res
        .status(404)
        .json({ message: "Inventory item tidak ditemukan" });
    }

    if (inventoryItem.product) {
      console.log("Hapus produk dengan ID:", inventoryItem.product._id);
      console.log("Hapus produk dengan ID:", inventoryItem.product.name);
      await Product.findByIdAndDelete(inventoryItem.product._id);
    }

    const io = socket.getIO();
    io.emit('deleteProduct', { message: `Produk telah dihapus. Dengan Nama: ${inventoryItem.product.name} dan SKU: ${inventoryItem.product.sku}.`, id: inventoryItem.product._id._id, warehouse: inventoryItem.product.warehouse });

    console.log("Hapus inventory item dengan ID:", req.params.id);
    await Inventory.findByIdAndDelete(req.params.id);

    res.json({
      message:
        "Produk dan Produk yang ada di Inventory telah berhasil dihapus. ",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error dalam menghapus inventory item.",
      error: error.message,
    });
  }
};


exports.getAllStockMovements = async (req, res) => {
  const warehouseId = req.user.warehouse;

  try {
    const products = await Product.find({ warehouse: warehouseId }).populate("category");

    let stockMovements = [];

    for (let product of products) {
      const inventoryMovements = await Inventory.find({ product: product._id, warehouse: warehouseId });
      const sales = await Sale.find({ 'items.product': product._id,warehouse: warehouseId, statusSale: 'Accepted' });

      const saleQuantity = sales.reduce((acc, sale) => {
        return acc + sale.items.reduce((sum, item) => sum + item.quantity, 0);
      }, 0);

      const initialQuantity = inventoryMovements.reduce((acc, curr) => acc + curr.initialQuantity, 0);
      const inQuantity = inventoryMovements.reduce((acc, curr) => acc + curr.inQuantity, 0);
      const finalQuantity = initialQuantity + inQuantity - saleQuantity;

      stockMovements.push({
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        category: product.category.name,
        initialQuantity,
        inQuantity,
        saleQuantity,
        finalQuantity,
      });
    }

    res.status(200).json(stockMovements);
  } catch (error) {
    console.error('Error fetching all stock movements:', error);
    res.status(500).json({ message: 'Error fetching all stock movements', error: error.message });
  }
};



exports.getProductDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id)
      .populate('category')
      .populate('warehouse')
      .exec();

    const inventoryStocks = await Inventory.find({
      product: id,
      statusIn: { $in: ['Rejected', 'Accepted', 'Waiting'] },
    })
      .populate('warehouse')
      .populate({
        path: 'sale',
        populate: {
          path: 'customer customerType',
        },
      })
      .exec();

    const sales = await Sale.find({ 'items.product': id })
      .populate('customer')
      .populate('customerType')
      .populate('warehouse')
      .populate({
        path: 'items',
        populate: { path: 'product' }
      })
      .exec();

    res.status(200).json({
      product,
      inventoryStocks,
      sales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
