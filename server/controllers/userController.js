const User = require("../models/User");
const Warehouse = require("../models/Warehouse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { name, email, password, warehouseId } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "User dengan Email ini sudah ada" });

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse)
      return res.json(404).json({ message: "Warehouse not found" });

    user = new User({ name, email, password, warehouse: warehouseId });
    await user.save();
    res.status(201).json({ message: "User telah berhasil didaftarkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials " });

    const token = jwt.sign(
      { id: user._id, warehouse: user.warehouse, role: user.role},
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);
    // konfigurasi nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Email pengirim
        pass: process.env.EMAIL_PASSWORD, //Password email pengirim
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const resetLink = `http://localhost:5173/resetPassword/${token}`;

    const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background-color: #ffffff;
    padding: 20px;
  }
  .header {
    background-color: #00466a;
    color: white;
    padding: 10px 20px;
    text-align: center;
  }
  .content {
    padding: 20px;
    text-align: center;
    color: black;
  }
  .button {
    display: inline-block;
    padding: 10px 20px;
    margin: 20px 0;
    background-color: #e7e7e7;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  .footer {
    text-align: center;
    padding: 20px;
    font-size: 0.8em;
    color: #888;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MANAGEMENT INVENTORY</h1>
    </div>
    <div class="content">
      <p>Anda telah meminta untuk mereset password akun Anda. Silakan klik tombol di bawah ini untuk melanjutkan.</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p>Jika Anda tidak meminta reset password, silakan abaikan email ini.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Management Inventory. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

    // Untuk mengirim email dengan link reset
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Link Reset Password - Management Inventory",
      html: emailTemplate,
    });

    res.send({ message: "Link reset password telah dikirim ke email Anda" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan. " });
    }

    user.password = password; // untuk memicu middle ware pre('save') pada schema user
    await user.save();

    res.status(200).json({ message: "Password berhasil di reset." });
  } catch (error) {
    res.status(500).json({ message: "Error dalam mereset password. " });
  }
};

exports.updateWarehouse = async (req, res) => {
  const { userId, warehouseId } = req.body; // Dalam praktik nyata, userId harusnya dari session atau token JWT
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    user.warehouse = warehouseId;
    await user.save();
    res.json({ message: "Ganti gudang berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId).populate("warehouse");
    if (!user)
      return res.status(404).json({ message: "user tidak ditemukan " });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDataUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("warehouse");
    if (!user)
      return res.status(404).json({ message: "user tidak ditemukan " });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestWarehouseChange = async (req, res) => {
  const { newWarehouseId } = req.body;
  const userId = req.user.id;
  const token = jwt.sign({ userId, newWarehouseId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const confirmationUrl = `http://localhost:5173/changeWarehouse/${token}`;

  await sendEmail(
    req.user.email,
    "Konfirmasi Ganti Gudang",
    `Silakan klik link ini untuk konfirmasi ganti gudang: ${confirmationUrl}`
  );

  res.json({
    message: "Email konfirmasi ganti gudang telah dikirim. Silakan cek email.",
  });
};

exports.confirmWarehouseChange = async (req, res) => {
  const { token } = req.params;
  try {
    const { userId, newWarehouseId } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    await User.findByIdAndUpdate(userId, { warehouse: newWarehouseId });
    res.json({ message: "Gudang berhasil diganti." });
  } catch (error) {
    res.status(500).json({ message: "Error konfirmasi ganti gudang " });
  }
};

exports.updateProfile = async (req, res) => {
  console.log("Update profile endpoint called");
  try {
    const userId = req.params.id;
    const { filePath } = req.body;

    console.log(filePath);

    if (!userId) {
      return res.status(400).send("User ID is required");
    }
    const { name, noHandphone, gender, dob } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found.");

    user.profilePicture = filePath;
    user.name = name;
    user.noHandphone = noHandphone;
    user.gender = gender;
    user.dob = dob;

    await user.save();
    res.status(200).send("Profil berhasil diperbarui. ");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    console.log(req.body);
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found.");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).send("Password lama salah.");

    user.password = newPassword;

    await user.save();

    res.status(200).send("Password berhasil diganti.");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.saveProfilePicture = async (req, res) => {
  const { userId } = req.body;

  if (!req.file) {
    return res.status(422).send("Image harus diupload!");
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const image = req.file.path;
    user.profilePicture = image;

    await user.save();
    res.status(200).send("Profil berhasil diperbarui. ");
  } catch (error) {
    console.error("Error saving profile picture: ", error);
    res.status(500).json({ message: "Error saving profile picture" });
  }
};

let isUpdatingProfilePicture = false;
exports.updateProfilePicture = async (req, res) => {
  if (isUpdatingProfilePicture) {
    return res
      .status(400)
      .json({ message: "Profile picture update already in progress" });
  }

  const { userId } = req.body;
  if (!req.file) {
    return res.status(422).send("Image harus diupload!");
  }

  isUpdatingProfilePicture = true;

  try {
    const user = await User.findById(userId);
    if (!user) {
      isUpdatingProfilePicture = false;
      return res.status(404).send("User not found.");
    }

    const image = req.file.path;
    user.profilePicture = image;

    await user.save();
    res.status(200).json({ message: "Profile Picture Updated Successfully " });
  } catch (error) {
    console.error("Error updating profile picture: ", error);
    res.status(500).json({ message: "Error updating profile picture " });
  } finally {
    isUpdatingProfilePicture = false;
  }
};

// Backend: Tambahkan endpoint baru untuk menyimpan path gambar
exports.saveProfilePicturePath = async (req, res) => {
  const { userId, profilePicture } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.profilePicture = profilePicture; // Simpan atau perbarui path gambar di profil pengguna
    await user.save();
    res.status(200).send("Profile picture path updated successfully.");
  } catch (error) {
    console.error("Error saving profile picture path: ", error);
    res.status(500).json({ message: "Error saving profile picture path" });
  }
};
