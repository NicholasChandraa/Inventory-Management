const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/product");
const InventoryItem = require("../models/InventoryItems");
const Warehouse = require("../models/Warehouse");
const Customer = require("../models/Customer");
const CustomerType = require("../models/CustomerType");
const Sale = require("../models/Sales");
const mongoose = require("mongoose");

// STOK OUT

exports.getAllStockOutInventory = async (req, res) => {
  const warehouseId = req.user.warehouse;

  try {
    const stockOuts = await InventoryItem.find({
      warehouse: warehouseId,
      saleQuantity: { $gte: 0 },
    })
      .populate("product")
      .populate("warehouse")
      .populate("createdBy")
      .populate("updatedBy")
      .exec();

    res.status(200).json(stockOuts);
  } catch (error) {
    console.error("Error fetching stock out data:", error);
    res
      .status(500)
      .json({ message: "Error fetching stock out data", error: error.message });
  }
};

exports.updateStockOut = async (req, res) => {
  const { id } = req.params;
  const { saleQuantity, noteSale, statusSale } = req.body;

  try {
    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      { noteSale, statusSale }, // Update fields
      { new: true } // Return the updated document
    ).populate("inventory");

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    if (updatedSale.inventory) {
      const stockOut = updatedSale.inventory; // Assuming this is a direct reference to the inventory document
      stockOut.saleQuantity = saleQuantity;
      stockOut.finalQuantity =
        stockOut.initialQuantity + stockOut.inQuantity - stockOut.saleQuantity; // Update the final quantity

      await stockOut.save(); // Save the updated inventory item
    }
    
    res
      .status(200)
      .json({
        message: "Stock out and sale updated successfully",
        sale: updatedSale,
      });
  } catch (error) {
    console.error("Error updating stock out:", error);
    res
      .status(500)
      .json({ message: "Error updating stock out", error: error.message });
  }
};

