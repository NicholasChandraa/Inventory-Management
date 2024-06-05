const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "admin",
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  noHandphone: { type: String },
  gender: { type: String },
  dob: { type: String },
  warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse" },
  profilePicture: { type: String },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
