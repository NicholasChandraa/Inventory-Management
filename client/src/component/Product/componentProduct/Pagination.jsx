/* eslint-disable */

import React from "react";

const Pagination = ({ page, totalPages, onNavigate }) => {
  return (
    <div className="flex justify-between items-center">
      <button
        className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded-l"
        onClick={() => onNavigate(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      {/* ... render pagination buttons ... */}
      <button
        className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded-l"
        onClick={() => onNavigate(page - 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};
