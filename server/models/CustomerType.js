const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const customerTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama Tipe Pelanggan harus diisi"],
      trim: true,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true
    },
  },
  {
    timestamps: true,
  }
);

// Menambahkan indeks unik, untuk nama kategori pada setiap gudang
customerTypeSchema.index({ name: 1, warehouse: 1 }, { unique: true });

const CustomerType = mongoose.model("CustomerType", customerTypeSchema);

module.exports = CustomerType;
