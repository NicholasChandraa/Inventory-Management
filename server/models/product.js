const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, "Nama produk harus diisi"],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, "Kategori produk harus diisi"],
    },
    sku: {
      type: String,
      required: [true, "SKU harus diisi"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Kuantitas stok harus diisi"],
      min: [0, "Kuantitas stok tidak boleh negatif"],
    },
    unit: {
      type: String,
      required: [true, "Satuan produk harus diisi"],
      trim: true,
    },
    purchasePrice: {
      type: Number,
      required: [true, "Harga beli produk harus diisi"],
      min: [0, "Harga beli tidak boleh negatif"],
    },
    sellPrice: {
      type: Number,
      required: [true, "Harga jual produk harus diisi"],
      min: [0, "Harga jual tidak boleh negatif"],
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse'
    }
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;