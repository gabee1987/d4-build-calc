import React, { useEffect, useState, useRef } from "react";
import "./reset-button.styles.scss";

const ResetButton = ({}) => {
  const handleReset = (nodes) => {
    console.log("nodes when reset -> ");
  };

  return (
    <div className="reset-button-container">
      <button className="reset-button">Reset</button>
    </div>
  );
};

export default ResetButton;
