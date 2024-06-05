const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const inventoryStockSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      warehouse: {
        type: Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true
      },
      initialQuantity: {
        type: Number,
        default: 0
      },
      inQuantity: {
        type: Number,
        default: 0
      },
      saleQuantity: {
        type: Number,
        default: 0
      },
      finalQuantity: {
        type: Number,
        get: function() {
          // calculate the final quantity based on movements
          return this.initialQuantity - this.saleQuantity;
        }
      },
      noteIn: String,
      statusIn: {
        type: String,
        enum: ['Accepted', 'Waiting', 'Rejected'],
        default: 'Waiting'
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      sale: {
        type: Schema.Types.ObjectId,
        ref: 'Sale',
      }
    }, {
      timestamps: true,
      toJSON: { getters: true },
      toObject: { getters: true }
    });
  

  const InventoryStock = mongoose.model("InventoryStock", inventoryStockSchema);

module.exports = InventoryStock;