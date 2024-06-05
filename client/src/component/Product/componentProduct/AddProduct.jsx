/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductNavigation from "../ProductNavigation";
import {
  Button,
  Label,
  TextInput,
  Select,
  Modal,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AddProduct = () => {
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    newCategory: "",
    sku: "",
    quantity: "",
    unit: "",
    purchasePrice: "",
    sellPrice: "",
  });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [showModal, setShowModal] = useState(false); //state untuk popup kembali ke halaman produk
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); //state untuk konfirmasi tambah produk

  const [userWarehouseId, setUserWarehouseId] = useState("");

  const navigate = useNavigate();

  const getUserIdFromToken = () => {
    const token = Cookies.get("Token");
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      return console.error("Token tidak ada !..", error);
    }
  };

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserWarehouseId(decoded.warehouse);
      fetchCategories(token);
      fetchData(token);
    } else {
      console.log("Token Tidak ada!");
    }
  }, []);

  const fetchCategories = async (token) => {
    try {
      const res = await axios.get(
        "https://inventory-management-api.vercel.app/api/product/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchData = async (token) => {
    try {
      const response = await axios.get("https://inventory-management-api.vercel.app/api/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "number"
        ? e.target.value === ""
          ? ""
          : Number(e.target.value)
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmationModal(false);
    const token = Cookies.get("Token");
    const userId = getUserIdFromToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Warehouse ID: ", userWarehouseId);

    console.log(formData.quantity);

    let payload;
    if (isNewCategory && formData.newCategory) {
      payload = {
        user: userId,
        name: formData.name,
        sku: formData.sku,
        quantity: formData.quantity,
        unit: formData.unit,
        purchasePrice: formData.purchasePrice,
        sellPrice: formData.sellPrice,
        newCategory: formData.newCategory,
        warehouse: userWarehouseId,
      };
    } else {
      payload = {
        ...formData,
        warehouse: userWarehouseId,
        category: formData.category,
        user: userId,
      };
    }

    console.log(payload);

    try {
      await axios.post(
        "https://inventory-management-api.vercel.app/api/product",
        JSON.stringify(payload),
        config,
      );
      setShowModal(true); // Untuk menampilkan Popup
    } catch (error) {
      console.error("Error adding product: ", error.response.data);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "new-category") {
      setIsNewCategory(true);
      setFormData({
        ...formData,
        category: "Masukkan Kategori Baru",
        newCategory: "",
      });
    } else {
      setIsNewCategory(false);
      setFormData({ ...formData, category: value, newCategory: "" });
    }
  };

  const handleNewCategoryChange = (e) => {
    // Update nilai untuk newCategory ketika user mengetik nama kategori baru
    setFormData({ ...formData, newCategory: e.target.value });
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const selectedProduct = product.find((p) => p._id === productId);
    if (selectedProduct) {
      setFormData({
        ...formData,
        name: selectedProduct.name,
        category: selectedProduct.category?._id || "",
        sku: selectedProduct.sku,
        quantity: selectedProduct.quantity.toString(),
        unit: selectedProduct.unit,
        purchasePrice: selectedProduct.purchasePrice.toString(),
        sellPrice: selectedProduct.sellPrice.toString(),
      });
    }
  };

  return (
    <>
      <ProductNavigation />
      <div className="m-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-medium">Daftar Produk</h1>

          <Link to="/Product">
            <Button color="light">Batal</Button>
          </Link>
        </div>

        <div className="border-b border-black"></div>

        <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
          <div className="flex justify-around">
            <div className="w-5/12">
              {/* Dropdown Produk */}
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="productList" value="Pilih Produk yang Ada" />
                </div>
                <Select id="productList" onChange={handleProductChange}>
                  <option value="">Pilih produk...</option>
                  {product.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.sku}
                    </option>
                  ))}
                </Select>
              </div>
              {/* NAMA PRODUK FORM */}
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="productName" value="Nama Produk" />
                </div>
                <TextInput
                  id="productName"
                  type="text"
                  name="name"
                  placeholder="Nama Produk"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CATEGORY FORM */}
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="category" value="Kategori" />
                </div>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  name="category"
                  required={!isNewCategory}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="new-category">Masukkan Kategori Baru</option>
                </Select>
                {isNewCategory && (
                  <TextInput
                    id="newCategory"
                    type="text"
                    name="newCategory"
                    placeholder="Ketik Kategori Baru . . ."
                    value={formData.newCategory}
                    onChange={handleNewCategoryChange}
                    required
                    className="mt-3"
                  />
                )}
              </div>

              {/* SKU FORM */}
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="productSKU" value="SKU" />
                </div>
                <TextInput
                  id="productSKU"
                  type="text"
                  name="sku"
                  placeholder="SKU Produk"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* JUMLAH FORM */}
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="productQuantity" value="Quantity" />
                </div>
                <TextInput
                  id="productQuantity"
                  type="number"
                  name="quantity"
                  placeholder="Jumlah Produk"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="w-5/12">
              {/* SATUAN FORM */}
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="productUnit" value="Satuan" />
                </div>
                <TextInput
                  id="productUnit"
                  type="text"
                  name="unit"
                  placeholder="Satuan"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* HARGA BELI FORM */}
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="purchasePrice" value="Harga Awal" />
                </div>
                <TextInput
                  id="purchasePrice"
                  type="number"
                  name="purchasePrice"
                  placeholder="Harga Awal Produk"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* HARGA JUAL FORM */}
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="SellPrice" value="Harga Jual" />
                </div>
                <TextInput
                  id="SellPrice"
                  type="number"
                  name="sellPrice"
                  placeholder="Harga Jual Produk"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <Button type="submit">Tambah Produk</Button>
        </form>

        {/* Modal konfirmasi tambah produk */}
        <Modal
          show={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
        >
          <ModalBody className="text-center">
            <p className="text-lg font-semibold">
              Yakin ingin menambahkan Produk?
            </p>
          </ModalBody>
          <ModalFooter className="justify-center items-center">
            <Button
              color="failure"
              onClick={() => setShowConfirmationModal(false)}
            >
              Batal
            </Button>
            <Button color="success" onClick={handleConfirmSubmit}>
              Iya
            </Button>
          </ModalFooter>
        </Modal>

        {/* Konten form dan navigasi lainnya */}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <ModalBody className="text-center">
            <p className="text-lg font-semibold">
              Produk berhasil ditambahkan!
            </p>
          </ModalBody>
          <ModalFooter className="justify-center items-center">
            <Button color="light" onClick={() => navigate("/Product")}>
              Kembali ke Daftar Produk
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default AddProduct;
