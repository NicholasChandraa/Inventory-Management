/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import SalesNavigation from "./SalesNavigation";
import { Modal, Button } from "flowbite-react";

function AddSales() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState("");
  const [formData, setFormData] = useState({
    productId: "",
    customerId: "",
    customerTypeId: "",
    quantity: "",
    saleDate: new Date().toISOString().slice(0, 10), // Default to today's date in yyyy-mm-dd format
    totalAmount: "",
    orderNumber: "",
    address: "",
    paymentStatus: "",
    deliveryStatus: "",
    paymentReceived: "",
  });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [paymentReceived, setPaymentReceived] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [produkStok, setProdukStok] = useState(0);

  const navigate = useNavigate();

  // Generate Order Number
  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = date.toTimeString().split(" ")[0].replace(/:/g, "");
    return `ORD${dateStr}${timeStr}`;
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      orderNumber: generateOrderNumber(),
    }));

    fetchProducts();
    fetchCustomers();
    fetchCustomerTypes();
  }, []);

  const fetchProducts = async () => {
    const token = Cookies.get("Token");
    if (!token) {
      console.log("Token tidak tersedia");
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/api/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(
        response.data.map((product) => ({
          ...product,
          sellPrice: product.sellPrice,
        })),
      );
    } catch (error) {
      console.error("Error fetching products:", error.response.data);
    }
  };

  const fetchCustomers = async () => {
    const token = Cookies.get("Token");
    if (!token) {
      console.log("Token tidak tersedia");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error.response.data);
    }
  };

  const fetchCustomerTypes = async () => {
    const token = Cookies.get("Token");
    if (!token) {
      console.log("Token tidak tersedia");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/customers/customer-types",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCustomerTypes(response.data);
    } catch (error) {
      console.error("Error fetching customer types:", error.response.data);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "quantity" || e.target.name === "totalAmount") {
      const updatedTotal = formData.totalAmount;
      setFormData({
        ...formData,
        remainingAmount: updatedTotal - formData.paymentReceived,
      });
    }
  };

  const handleProductChange = async (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);

    const product = products.find((p) => p._id === productId);
    if (product) {
      const updatedTotalAmount = product.sellPrice * quantity;

      // Fetch inventory details for the selected product
      const token = Cookies.get("Token");
      try {
        const inventoryResponse = await axios.get(
          `http://localhost:5000/api/inventory/stock/byproduct/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const inventoryItem = inventoryResponse.data[0];
        const availableStock = inventoryItem ? inventoryItem.finalQuantity : 0;
        setProdukStok(availableStock);


        setFormData({
          ...formData,
          productId,
          inventoryId: inventoryItem._id, // Storing inventory ID fetched
          sellPrice: product.sellPrice,
          totalAmount: updatedTotalAmount,
        });

        setTotalAmount(updatedTotalAmount);
      } catch (error) {
        console.error("Failed to fetch inventory details:", error);
      }
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);

    if (formData.productId) {
      const product = products.find((p) => p._id === formData.productId);
      if (product) {
        const updatedTotalAmount = product.sellPrice * newQuantity;

        setFormData({
          ...formData,
          quantity: newQuantity,
          totalAmount: updatedTotalAmount,
        });
        setTotalAmount(updatedTotalAmount);
      }
    }
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setSelectedCustomer(customerId);

    const customer = customers.find((c) => c._id === customerId);
    if (customer) {
      setFormData({
        ...formData,
        customerId: customerId,
        customerTypeId: customer.customerType.id, // Assuming this now holds the name directly
        address: `${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zipCode}`,
      });

      setSelectedCustomerType(customer.customerType.name); // Directly use the string
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(quantity) > produkStok) {
      setIsErrorModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    const token = Cookies.get("Token");

    const decoded = jwtDecode(token);
    const warehouseId = decoded.warehouse;
    const remainingAmount = formData.totalAmount - formData.paymentReceived;

    const payload = {
      items: [
        {
          product: formData.productId,
          inventoryId: formData.inventoryId,
          quantity: Number(formData.quantity),
        },
      ],
      customer: formData.customerId,
      customerType: formData.customerTypeId,
      totalAmount: Number(formData.totalAmount),
      orderNumber: formData.orderNumber,
      address: formData.address,
      paymentStatus: formData.paymentStatus,
      deliveryStatus: formData.deliveryStatus,
      paymentReceived: Number(formData.paymentReceived),
      remainingAmount: remainingAmount,
      warehouse: warehouseId,
    };

    try {
      await axios.post("http://localhost:5000/api/sales", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsModalOpen(false);
      navigate("/sales");
    } catch (error) {
      console.error("Failed to add sale:", error.response.data);
      alert(`Failed to add sale: ${error.response.data.message}`);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <SalesNavigation />
      <div className="max-w-5xl mx-auto p-5 shadow-md m-5 mt-10 rounded-lg">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Tambah Penjualan</h2>
          </div>
          <Link to={"/sales"}>
            <button className="bg-red-600 text-white rounded-lg px-3 py-1 text-lg">
              Batal
            </button>
          </Link>
        </div>
        <div className="border-b-2 mt-2 mb-5"></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-10 mb-6">
            <div className="w-full flex flex-col gap-7">
              <div className="flex flex-col">
                <label className="font-medium">Nomor Pesanan</label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Produk</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleProductChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {/* Option Default */}
                  <option value="" disabled>
                    Pilih Produk
                  </option>

                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Pelanggan</label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleCustomerChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {/* Option Default */}
                  <option value="" disabled>
                    Pilih Pelanggan
                  </option>

                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Tipe Pelanggan </label>
                <input
                  type="text"
                  value={selectedCustomerType || "Tidak ada tipe yang dipilih"}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Harga Jual</label>
                <input
                  type="text"
                  readOnly
                  value={formData.sellPrice || ""}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Stok Saat ini</label>
                <label>{produkStok}</label>
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Quantity atau Jumlah</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-7">
              <div className="flex flex-col">
                <label className="font-medium">Total Harga</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Pembayaran Diterima</label>
                <input
                  type="number"
                  name="paymentReceived"
                  value={formData.paymentReceived}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Sisa Pembayaran</label>
                <input
                  type="number"
                  name="remainingAmount"
                  value={formData.totalAmount - formData.paymentReceived}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Alamat</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Status Pembayaran</label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Tunda">Tunda</option>
                  <option value="Konfirmasi">Konfirmasi</option>
                  <option value="Dalam Pembayaran">Dalam Pembayaran</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Status Pengiriman</label>
                <select
                  name="deliveryStatus"
                  value={formData.deliveryStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Tunda">Tunda</option>
                  <option value="Konfirmasi">Konfirmasi</option>
                  <option value="Dikirim">Dikirim</option>
                  <option value="Terkirim">Terkirim</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Tambah Penjualan
          </button>
        </form>
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Konfirmasi Penjualan</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p>Apakah anda yakin ingin menambahkan penjualan ini?</p>
            <ul>
              <li>Nomor Pesanan: {formData.orderNumber}</li>
              <li>
                Produk:{" "}
                {products.find((p) => p._id === formData.productId)?.name}
              </li>
              <li>
                Pelanggan:{" "}
                {customers.find((c) => c._id === formData.customerId)?.name}
              </li>
              <li>Total Harga: {formData.totalAmount}</li>
              <li>Pembayaran Diterima: {formData.paymentReceived}</li>
              <li>
                Sisa Pembayaran:{" "}
                {formData.totalAmount - formData.paymentReceived}
              </li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirm}>Konfirmasi</Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)}>
        <Modal.Header>Perhatian</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p>Stok Produk tidak Cukup !</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setIsErrorModalOpen(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddSales;
