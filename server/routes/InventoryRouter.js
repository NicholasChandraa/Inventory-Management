const express = require("express");
const router = express.Router();
const {
  getInventoryStock,
  addInventoryStock,
  updateInventoryStock,
  deleteInventoryStock,
  getProductInventory,
  getAllStockMovements,
  getProductDetails
} = require("../controllers/InventoryController");
const {
  getAllStockOutInventory,
  updateStockOut,
} = require("../controllers/InventoryStockOutController");
const { authMiddleware, adminCheck } = require("../middleware/authMiddleware");

// Stok Keluar Router
router.get("/stock/stock-out", authMiddleware, adminCheck, getAllStockOutInventory);
router.get("/stock/stock-out/:id", authMiddleware, adminCheck, updateStockOut);
router.get("/stock/stock-movements", authMiddleware, adminCheck, getAllStockMovements );

// get one inventori dan produk detail
router.get("/stock/stock-movement/:id", authMiddleware, adminCheck, getProductDetails );


// Stok Masuk Router
router.get("/stock/byproduct/:productId", authMiddleware, adminCheck, getProductInventory);

router.get("/stock", authMiddleware, adminCheck, getInventoryStock);
// GET untuk mendapatkan data inventory yang ditampilkan pada halaman product
router.post("/stock", authMiddleware, adminCheck, addInventoryStock);
router.put("/stock/:id", authMiddleware, adminCheck, updateInventoryStock);
router.delete("/stock/:id", authMiddleware, adminCheck, deleteInventoryStock);

module.exports = router;
