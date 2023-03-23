import React, { useState } from "react";
import "./skill-tooltip.styles.scss";

const SkillTooltipComponent = ({ children, skill, points, isActive }) => {
  const [visible, setVisible] = useState(false);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <g onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {visible && (
        <foreignObject
          className="tooltip"
          x={-150}
          y={-100}
          width={300}
          height={200}
        >
          <div className="tooltipContent">
            <h3>{skill.name}</h3>
            <p>{skill.description}</p>
            <p>
              Points: {points}/{skill.maxPoints}
            </p>
            <p>Active: {isActive ? "Yes" : "No"}</p>
          </div>
        </foreignObject>
      )}
      {children}
    </g>
  );
};

export default SkillTooltipComponent;
