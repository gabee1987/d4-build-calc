import React from "react";

import "./share-button.styles.scss";

const ShareButton = () => {
  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="share-button-container">
      <button className="share-button" onClick={copyUrl}>
        <svg
          viewBox="-3 -8 40 40"
          width="40px"
          height="40px"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          class="share-icon"
        ></svg>
      </button>
    </div>
  );
};

export default ShareButton;
