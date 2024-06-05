/* eslint-disable */
import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function FilterBar({ onChange, initialFilters }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      onChange({ ...initialFilters, [name]: value });
    };

    const handleClearFilters = () => {
      onChange({ date: '', statusIn: '', updatedBy: ''});
    };
  
    return (
        <div className='ml-6 mt-6 mr-6'>
        <form className="p-4 rounded-md shadow flex items-center space-x-4">
        <input
          type="date"
          name="date"
          value={initialFilters.date}
          onChange={handleChange}
          className="p-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <select
          name="statusIn"
          value={initialFilters.statusIn}
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
  
  export default FilterBar;