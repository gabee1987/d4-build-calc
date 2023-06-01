import React from "react";
import "./lazy-load-fallback.styles.scss";

const LazyLoadFallbackComponent = ({ text }) => {
  return (
    <div className="fallback-spinner">
      <div className="loader-container">
        <div className="loader">
          <div className="loader-inner"></div>
        </div>
        <div className="loading-text">{text}</div>
      </div>
    </div>
  );
};

export default LazyLoadFallbackComponent;
