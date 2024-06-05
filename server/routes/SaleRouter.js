const express = require("express");
const router = express.Router();
const { authMiddleware, adminCheck } = require("../middleware/authMiddleware");
const { getAllSales, getOneSale, addSale, updateSale, deleteSale, } = require("../controllers/SaleController");




router.get("/", authMiddleware, getAllSales);
router.get("/:id", authMiddleware, getOneSale);
router.post("/", authMiddleware, addSale);
router.put("/:id", authMiddleware, updateSale);
router.delete("/:id", authMiddleware, deleteSale);

module.exports = router;
