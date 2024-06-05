/* eslint-disable */
import React, { useState } from "react";
import { Link } from "react-router-dom";

const PaginationComponent = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPrevPage = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  const goToPage = (pageNumber) => {
    const number = Math.max(1, Math.min(totalPages, pageNumber));
    onPageChange(number);
  };

  const [goToInput, setGoToInput] = useState(currentPage);

  return (
    <div className="flex items-center space-x-2 font-medium">
      <button
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        className="px-2 py-2 text-gray-900"
      >
        {"<"}
      </button>
      <span className="px-2 py-2 ">{currentPage}</span>
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-gray-900"
      >
        {">"}
      </button>
      <input
        type="number"
        value={goToInput}
        onChange={(e) => setGoToInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && goToPage(Number(goToInput))}
        className="px-2 py-2 w-40 border rounded-lg shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      />
      <button
        onClick={() => goToPage(Number(goToInput))}
        className="px-4 py-2 text-gray-900 font-medium"
      >
        Go to
      </button>
    </div>
  );
};

export default PaginationComponent;
