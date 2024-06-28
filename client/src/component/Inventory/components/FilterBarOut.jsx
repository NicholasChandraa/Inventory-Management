/* eslint-disable */
import React from "react";

function FilterBarOut({ onChange, initialFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...initialFilters, [name]: value });
  };

  const handleClearFilters = () => {
    onChange({ date: "", statusSale: "", updatedBy: "" }); // Change 'createdBy' to 'updatedBy'
  };

  return (
    <div className="m-4 md:m-8">
      <h1 className="text-2xl font-semibold mb-4">STOK KELUAR</h1>
      <div className="border-b-2 mb-5"></div>
      <form className="p-4 rounded-md shadow flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="date"
          name="date"
          value={initialFilters.date}
          onChange={handleChange}
          className="p-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <select
          name="statusSale"
          value={initialFilters.statusSale}
          onChange={handleChange}
          className="p-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">Semua Status</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
          <option value="Waiting">Waiting</option>
        </select>
        <input
          type="text"
          name="updatedBy"
          placeholder="Dibuat Oleh.."
          value={initialFilters.updatedBy}
          onChange={handleChange}
          className="p-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <button
          type="button"
          onClick={handleClearFilters}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Bersihkan Filter
        </button>
      </form>
    </div>
  );
}

export default FilterBarOut;
