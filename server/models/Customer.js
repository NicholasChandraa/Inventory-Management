const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true }
  },
  customerType: {
    type: Schema.Types.ObjectId,
      ref: 'CustomerType'
  },
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: [true, "Warehouse harus diisi"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

customerSchema.index({ email: 1, warehouse: 1 }, { unique: true });

module.exports = mongoose.model('Customer', customerSchema);