const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("./product");
const InventoryStock = require("./InventoryItems");

const saleItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Produk harus diisi"],
    },
    quantity: {
      type: Number,
      required: [true, "Kuantitas harus diisi"],
      min: [1, "Kuantitas harus lebih besar dari 0"],
    },
    inventory: {
      type: Schema.Types.ObjectId,
      ref: "InventoryStock",
    },
  },
  { _id: false }
); // _id false untuk mencegah pembuatan id otomatis untuk subdokumen

const saleSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "Nomor pesanan harus diisi"],
      trim: true,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: [true, "Gudang harus diisi"],
    },
    saleDate: {
      type: Date,
      required: [true, "Tanggal penjualan harus diisi"],
      default: Date.now,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Pelanggan harus diisi"],
    },
    customerType: {
      type: Schema.Types.ObjectId,
      ref: "CustomerType",
      required: [true, "Tipe Pelanggan harus diisi"],
    },
    items: [saleItemSchema],
    totalAmount: {
      type: Number,
      required: [true, "Total harus diisi"],
    },
    remainingAmount: {
      type: Number,
      required: [true, "Sisa harus diisi"],
    },
    paymentReceived: {
      type: Number,
      requred: [true, "Payment Received harus diisi"],
    },
    paymentStatus: {
      type: String,
      enum: ["Tunda", "Konfirmasi", "Dalam Pembayaran", "Lunas", "Batal"],
      required: [true, "Status pembayaran harus diisi"],
    },
    deliveryStatus: {
      type: String,
      enum: ["Tunda", "Konfirmasi", "Dikirim", "Terkirim", "Selesai", "Batal"],
      required: [true, "Status pengiriman harus diisi"],
    },
    noteSale: String,
    statusSale: {
      type: String,
      enum: ["Accepted", "Waiting", "Rejected"],
      default: "Waiting",
    },
  },
  {
    timestamps: true,
  }
);

// Hitung totalAmount
saleSchema.pre("save", async function (next) {
  let total = 0;

  for (const item of this.items) {
    const product = await Product.findById(item.product).exec();
    if (!product) {
      const err = new Error(`Product with ID ${item.product} not found`);
      next(err);
      return;
    }

    total += product.sellPrice * item.quantity;

    // Perbarui InventoryStock dengan mengurangi jumlah yang terjual
    if (this.statusSale === 'Accepted'){
    try {
      const inventoryUpdate = await InventoryStock.findOneAndUpdate(
        { product: item.product },
        { $inc: { saleQuantity: item.quantity } },
        { new: true }
      );

      if (!inventoryUpdate) {
        console.error('InventoryStock for product not found or update failed:', item.product);
        // Pertimbangkan untuk membuat record baru di InventoryStock jika diperlukan
      }
    } catch (error) {
      console.error('Error updating InventoryStock:', error);
      next(error);
    }
  }
  }

  this.totalAmount = total;
  next();
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
