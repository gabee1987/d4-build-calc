import React from "react";
import "./search.styles.scss";

const SearchComponent = ({ onSearch }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search skills..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchComponent;
