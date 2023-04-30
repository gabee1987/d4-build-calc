import React, { useState } from "react";
import "./search.styles.scss";

const SearchComponent = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search skills..."
        value={searchValue}
        onChange={handleSearchChange}
      />
      {searchValue && (
        <button className="clear-search" onClick={handleClearSearch}>
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchComponent;
