/* eslint-disable */

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import SalesNavigation from "./SalesNavigation";

function SaleDetail() {
  const [sale, setSale] = useState(null);
  const { saleId } = useParams();

  useEffect(() => {
    const fetchSaleDetail = async () => {
      const token = Cookies.get("Token");

      try {
        const response = await axios.get(
          `https://inventory-management-api.vercel.app/api/sales/${saleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setSale(response.data);
      } catch (error) {
        console.error("Error dalam fetching sale detail: ", error);
      }
    };

    fetchSaleDetail();
  }, [saleId]);

  if (!sale) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-center mt-10">
        <div className="max-w-2xl w-full">
          <div className="bg-white shadow-2xl rounded-lg mx-auto overflow-hidden">
            <div className="bg-blue-600 py-10 px-8 flex justify-between items-center">
              <h1 className="text-lg md:text-2xl text-white font-bold">
                DETAIL PENJUALAN
              </h1>
              <div className="text-right">
                <p className="text-xs md:text-sm text-blue-200">
                  Pesanan # {sale.orderNumber}
                </p>
                <p className="text-xs md:text-sm text-blue-200">
                  {new Date(sale.saleDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm md:text-md text-gray-600">
                  <div className="font-bold text-gray-800">Pelanggan</div>
                  <div>{sale.customer.name}</div>
                </div>
                <div className="text-sm md:text-md text-gray-600">
                  <div className="font-bold text-gray-800">Tipe Pelanggan</div>
                  <div>{sale.customerType.name}</div>
                </div>
              </div>
              <div className="mt-4 text-sm md:text-md text-gray-600">
                <div className="font-bold text-gray-800">Gudang</div>
                <div>{sale.warehouse.name}</div>
              </div>
            </div>
            <div className="py-4 px-8 border-t border-gray-200">
              <h2 className="text-md md:text-lg text-gray-800 font-bold">
                Produk :
              </h2>
              {sale.items.map((item, index) => (
                <div
                  key={index}
                  className="my-2 hover:bg-gray-50 flex justify-between items-center rounded transition-colors duration-300"
                >
                  <div>
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-xs text-gray-500">
                      Jumlah: {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm text-end">
                    <span className="font-semibold">Harga Per Satuan</span> <br/> 
                    Rp. {item.product.sellPrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="py-6 px-8 border-t border-gray-200">
              <div className="flex justify-between">
                <div className="text-sm md:text-md text-gray-600">
                  <div className="font-bold text-gray-800">Total Harga</div>
                  <div>Rp. {sale.totalAmount.toLocaleString()}</div>

                  <div className="font-bold text-gray-800 mt-3">Pembayaran Diterima</div>
                  <div>Rp. {sale.paymentReceived.toLocaleString()}</div>
                </div>
                <div className="text-sm md:text-md text-gray-600 text-end">
                  <div className="font-bold text-gray-800">
                    Sisa Pembayaran
                  </div>
                  <div>Rp. {sale.remainingAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="py-6 px-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm md:text-md text-gray-600">
                  <div className="font-bold text-gray-800">Status Pembayaran</div>
                  <div className="text-xs md:text-sm">{sale.paymentStatus}</div>
                </div>
                <div className="text-sm md:text-md text-gray-600 text-end">
                  <div className="font-bold text-gray-800">Status Pengiriman</div>
                  <div className="text-xs md:text-sm">
                    {sale.deliveryStatus}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 py-7 px-8 flex justify-between items-center">
              <Link to={"/sales"}>
                <button className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Balik ke Penjualan
                </button>
              </Link>
              <Link to={"/inventory/inventoryPage/InventoryOutStock/*"}>
                <button className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Balik ke Inventori
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SaleDetail;
