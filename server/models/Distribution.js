const mongoose = require("mongoose");
const { Schema } = mongoose;

const distributionSchema = new Schema(
  {
    nomorDistribusi: {
      type: String,
      required: true,
      unique: true,
    },
    namaDistribusi:{
        type: String,
        required: true
    },
    tanggalDistribusi: {
      type: Date,
      required: true,
    },
    namaPenerima: {
      type: String,
      required: true,
    },
    namaPengirim: {
      type: String,
      required: true,
    },
    statusVerifikasi: {
      type: String,
      enum: ["Tertunda", "Disetujui", "Ditolak", "Dalam Proses"],
      default: "Tertunda",
    },
    statusPengiriman: {
      type: String,
      enum: ["Diproses", "Dikirim", "Tiba di Tujuan", "Selesai"],
      default: "Diproses",
    },
    biayaDistribusi: {
      type: Number,
      required: true,
    },
    catatan: String,
    warehouse: {
        type: Schema.Types.ObjectId,
        ref: "Warehouse",
        require: [true, "Gudang Harus Diisi"]
    }
  },
  {
    timestamps: true,
  }
);

const Distribution = mongoose.model("Distribution", distributionSchema);

module.exports = Distribution;
