/* eslint-disable */

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [profit, setProfit] = useState(0); // Tambahkan state untuk profit
  const [chartData, setChartData] = useState([]);
  const [chartDataAndDate, setChartDataAndDate] = useState([]);
  const [stats, setStats] = useState({
    totalPurchasePrice: 0,
    totalSellPrice: 0,
    profit: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [distributionData, setDistributionSalesData] = useState([]);

  useEffect(() => {
    const token = Cookies.get("Token");

    async function fetchData() {
      const revenueResponse = await axios.get(
        "https://inventory-management-api.vercel.app/api/dashboard/revenue",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const expensesResponse = await axios.get(
        "https://inventory-management-api.vercel.app/api/dashboard/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (revenueResponse.data[0]) {
        setRevenue(revenueResponse.data[0].total);
      }

      if (expensesResponse.data[0]) {
        setExpenses(expensesResponse.data[0].total);
      }
    }

    async function fetchStatsData() {
      const token = Cookies.get("Token");
      try {
        const response = await axios.get(
          "https://inventory-management-api.vercel.app/api/dashboard/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // Anda mungkin perlu menyesuaikan ini tergantung format data yang Anda terima
        setChartDataAndDate(response.data);
      } catch (error) {
        console.error("Error fetching stats data:", error);
      }
    }

    const fetchPriceComparison = async () => {
      try {
        const { data } = await axios.get(
          "https://inventory-management-api.vercel.app/api/dashboard/price-comparison",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStats({
          totalPurchasePrice: data.totalPurchasePrice,
          totalSellPrice: data.totalSellPrice,
          profit: data.profit,
        });
      } catch (error) {
        console.error("Error fetching price comparison data:", error);
      }
    };

    const fetchSalesStats = async () => {
      try {
        const { data } = await axios.get(
          "https://inventory-management-api.vercel.app/api/dashboard/sales-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSalesData(
          data.map((item) => ({
            date: item._id,
            totalAmount: item.totalAmount,
            count: item.count,
          })),
        );
      } catch (error) {
        console.error("Error fetching sales stats:", error);
      }
    };

    const fetchDistributionStats = async () => {
      try {
        const { data } = await axios.get(
          "https://inventory-management-api.vercel.app/api/dashboard/distribution-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setDistributionSalesData(
          data.map((item) => ({
            date: item._id,
            totalCost: item.totalCost,
            count: item.count,
          })),
        );
      } catch (error) {
        console.error("Error fetching distribution stats:", error);
      }
    };

    fetchDistributionStats();

    fetchSalesStats();

    fetchPriceComparison();

    fetchStatsData();

    fetchData();
  }, []);

  // Pastikan untuk memindahkan data ke dalam useEffect
  // agar variabel-variabel terkait berada dalam scope yang benar
  useEffect(() => {
    const calculatedProfit = revenue - expenses;
    setProfit(calculatedProfit);

    setChartData([
      { name: "Pendapatan", value: revenue },
      { name: "Pengeluaran", value: expenses },
      { name: "Keuntungan", value: calculatedProfit },
    ]);
  }, [revenue, expenses]);

  const priceComparison = [
    {
      name: "Harga Awal",
      amount: stats.totalPurchasePrice,
    },
    {
      name: "Harga Jual",
      amount: stats.totalSellPrice,
    },
    {
      name: "Keuntungan",
      amount: stats.profit,
    },
  ];

  return (
    <div className=" m-8 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">DASHBOARD</h2>
      <div className="border-b-4 mb-8"></div>
      <div className="font-medium text-xl mb-2">Summary</div>
      <div className="border-b-2 mb-8"></div>
      <div className="flex justify-between font-semibold gap-8 mb-5">
        <div className="shadow rounded-md w-full h-20 p-4">
          <p>Pendapatan</p>
          <span className="text-green-600">Rp. {revenue.toLocaleString()}</span>
        </div>
        <div className="shadow rounded-md w-full p-4">
          <p>Pengeluaran</p>
          <span className="text-red-600">Rp. {expenses.toLocaleString()}</span>
        </div>
        <div className="shadow rounded-md w-full p-4">
          <p>Keuntungan</p>
          <span className="text-blue-600">Rp. {profit.toLocaleString()}</span>
        </div>
      </div>

      <div className="my-6 shadow border rounded-lg">
        <h3 className="my-6 text-lg font-medium text-center">
          Statistik Profit Penjualan dan Pengeluaran Distribusi Per Hari Ini
        </h3>
        <LineChart
          width={1200}
          height={300}
          data={chartDataAndDate}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          className="p-2"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [`Rp. ${value.toLocaleString()}`, name]}
          />
          <Legend
            formatter={(value) => {
              if (value === "totalSales") return "Penjualan Total";
              if (value === "totalExpenses") return "Total Pengeluaran";
              if (value === "profit") return "Keuntungan";
              return value;
            }}
          />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
            name="Total Pendapatan Penjualan"
          />
          <Line
            type="monotone"
            dataKey="totalExpenses"
            stroke="#8884d8"
            name="Total Pengeluaran Distribusi"
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#ffc658"
            name="Keuntungan"
          />
        </LineChart>

        <div className="flex justify-between">
          <h3 className="mx-10 mb-10 text-red-600 font-medium">
            Penjualan Profit :
            <span className="font-bold"> {revenue.toLocaleString()}</span>
          </h3>

          <h3 className="mx-10 mb-10 font-medium">
            Total :<span className="font-bold"> {profit.toLocaleString()}</span>
          </h3>

          <h3 className="mx-10 mb-10 text-blue-600 font-medium">
            Pengeluaran Distribusi :
            <span className="font-bold"> {expenses.toLocaleString()}</span>
          </h3>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="my-6 shadow border rounded-lg">
          <h3 className="my-6 text-lg font-medium text-center">
            Statistik Pendapatan dan Pengeluaran
          </h3>
          <LineChart
            width={1200}
            height={300}
            data={chartData}
            className=" p-2"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                `Rp. ${value.toLocaleString()}`,
                name,
              ]}
            />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>

          <h3 className="mx-10 mb-10 font-medium text-end">
            Keuntungan :
            <span className="font-bold"> {profit.toLocaleString()}</span>
          </h3>
        </div>

        <div className="my-6 shadow border rounded-lg">
          <h3 className="my-6 text-lg font-medium text-center">
            Statistik Harga Awal vs Harga Jual
          </h3>
          <LineChart
            width={1200}
            height={300}
            data={priceComparison}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            className="p-2 mb-4"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                `Rp. ${value.toLocaleString()}`,
                name,
              ]}
            />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="my-6 shadow border rounded-lg">
          <h3 className="my-6 text-lg font-medium text-center">
            Data Penjualan Produk
          </h3>
          <LineChart
            width={1200}
            height={300}
            data={salesData}
            className="p-2 mb-6"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                `Rp. ${value.toLocaleString()}`,
                name,
              ]}
            />
            <Legend
              formatter={(value) =>
                value === "totalAmount" ? "Total Penjualan Produk" : value
              }
            />
            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke="#8884d8"
              name="Total Penjualan Produk"
            />
          </LineChart>
        </div>

        <div className="mt-6 shadow border rounded-lg">
          <h3 className="my-6 text-lg font-medium text-center">
            Data Distribusi
          </h3>
          <LineChart
            width={1200}
            height={300}
            data={distributionData}
            className="p-2 mb-6"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                `Rp. ${value.toLocaleString()}`,
                name,
              ]}
            />
            <Legend
              formatter={(value) =>
                value === "totalCost" ? "Total Pengeluaran Distribusi" : value
              }
            />
            <Line
              type="monotone"
              dataKey="totalCost"
              stroke="#82ca9d"
              name="Total Pengeluaran Distribusi"
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
