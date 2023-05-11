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
          className="share-icon"
        >
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
        </svg>
      </button>
    </div>
  );
};

export default ShareButton;
