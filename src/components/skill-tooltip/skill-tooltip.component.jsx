import React from "react";
import "./skill-tooltip.styles.scss";

const SkillTooltipComponent = ({ nodeData, position }) => {
  if (!nodeData || !position) {
    return null;
  }

  return (
    <div
      className="skill-tooltip"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <h3>{nodeData.name}</h3>
      <p>Type: {nodeData.nodeType}</p>
      <p>Allocated Points: {nodeData.allocatedPoints}</p>
      <p>Max Points: {nodeData.maxPoints}</p>
      {nodeData.description && <p>Description: {nodeData.description}</p>}
    </div>
  );
};

export default SkillTooltipComponent;
