/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const SearchComponent = ({ onSearch }) => {
  return (
    <div className="p-8">
      <input
        type="search"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
      />
    </div>
  );
};

export default SearchComponent;
