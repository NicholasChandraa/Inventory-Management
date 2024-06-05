/* eslint-disable */
import React, { useState, useEffect } from "react";
import ProductNavigation from "./ProductNavigation";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function ProductPage() {
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(currentPage, itemsPerPage);
    fetchCategories();
  }, [currentPage, itemsPerPage]);

  const fetchData = async (page, limit) => {
    try {
      const token = Cookies.get("Token");
      const response = await axios.get("http://localhost:5000/api/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = Cookies.get("Token");
      const response = await axios.get(
        "http://localhost:5000/api/product/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCategories(response.data);
      console.log("Categories fetched successfully");
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("id-ID");
  };

  const handleDetail = async (id) => {
    const token = Cookies.get("Token");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProduct(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error dalam mendapatkan api detail atau /:id", error);
    }
  };

  //Fitur Search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fitur flter category
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredProducts = product.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || p.category.name === selectedCategory),
  );

  // Handle Pagenation

  // Calculate the number of pages
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Update page change
  const handlePageChange = (event) => {
    const pageNumber = Number(event.target.value);
    setCurrentPage(pageNumber);
  };

  // Update items per page
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <ProductNavigation />

      <div className="m-6">
        <div className="flex justify-end mb-5 items-center justify-between">
          <div>
            <input
              type="text"
              placeholder="Cari Nama Produk"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded-lg"
            />
          </div>
          <div className="flex">
            <select
              onChange={handleCategoryChange}
              className="mx-2 border rounded rounded-lg"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <Link to="/Product/ProductPage/AddProduct/*">
              <div className="text-white rounded py-2 px-3 font-bold bg-[#67C23A] hover:bg-[#59B32D] active:bg-[#397B18]">
                + Tambah
              </div>
            </Link>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <>
            <table className="min-w-full leading-normal shadow mb-5">
              <thead className="">
                <tr className="border-b-2 border-gray-300">
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tl-md">
                    Nama Produk
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Qty Stok
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Satuan
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Harga Awal
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Harga Jual
                  </th>
                  <th className="px-5 py-3 bg-gray-800 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider rounded-tr-md">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((p) => (
                  <tr key={p._id}>
                    <td className="py-2 px-6 border-b border-grey-light text-blue-600 hover:text-blue-800 text-start">
                      <Link to={`/product/ProductDetailPage/${p._id}`}>
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-2 px-6 border-b  text-start">
                      {p.category
                        ? p.category.name
                        : "Kategori Tidak Diketahui"}
                    </td>
                    <td className="py-2 px-6 border-b  text-start">{p.sku}</td>
                    <td className="py-2 px-6 border-b  text-start">
                      {formatCurrency(p.quantity)}
                    </td>
                    <td className="py-2 px-6 border-b  text-start">{p.unit}</td>
                    <td className="py-2 px-6 border-b  text-start">
                      Rp. {formatCurrency(p.purchasePrice)}
                    </td>
                    <td className="py-2 px-6 border-b  text-start">
                      Rp. {formatCurrency(p.sellPrice)}
                    </td>
                    <td className="py-2 px-6 border-b text-start flex items-center justify-center">
                      <Link to={`/Product/ProductPage/EditProduct/${p._id}`}>
                        <button className="text-white bg-blue-500 rounded-lg hover:bg-blue-700 w-16 h-8">
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 font-semibold">
              Produk tidak ditemukan
            </p>
          </div>
        )}

        {/* PAGENATION */}
        <div className="pagination-controls mt-6 flex items-center gap-3">
          <div className="items-per-page">
            <select
              onChange={handleItemsPerPageChange}
              value={itemsPerPage}
              className="rounded-lg border font-medium focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value={10}>10/page</option>
              <option value={20}>20/page</option>
              <option value={30}>30/page</option>
              {/* Add more options as needed */}
            </select>
          </div>

          <div className="page-count font-medium mx-5">
            Total {filteredProducts.length}
          </div>

          <div className="page-navigation font-medium flex">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &lt;
            </button>
            <p className="mx-5">{currentPage}</p>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
            >
              &gt;
            </button>
          </div>

          <div className="go-to-page">
            <input
              type="number"
              min={1}
              max={pageCount}
              value={currentPage}
              onChange={handlePageChange}
              className="rounded-lg border font-medium mx-4 w-40 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <button
              onClick={() => setCurrentPage(Number(currentPage))}
              className="font-medium"
            >
              Go to
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
