const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama kategori harus diisi"],
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
categorySchema.index({ name: 1, warehouse: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
