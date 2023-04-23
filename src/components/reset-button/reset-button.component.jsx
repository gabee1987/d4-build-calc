import React, { useEffect, useState, useRef } from "react";

import { resetNodes } from "../../helpers/skill-tree/skill-tree-utils";

import "./reset-button.styles.scss";

const ResetButton = ({ nodes, links, svg, nodeGroup }) => {
  const handleReset = () => {
    console.log("reset all nodes... -> ");
    resetNodes(nodes, links, svg, nodeGroup);
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
