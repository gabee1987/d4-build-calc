import React from "react";

import "./reset-button.styles.scss";

const ResetButton = ({ setResetStatus }) => {
  const handleReset = () => {
    setResetStatus(true);
  };

  return (
    <div className="reset-button-container">
      <button className="reset-button" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default ResetButton;
