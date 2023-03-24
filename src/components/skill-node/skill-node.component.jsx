// import React from "react";

// const SkillNode = ({ node, onClick }) => {
//   const { id, name, points, maxPoints } = node;
//   return (
//     <div className="skill-node" id={id} onClick={onClick}>
//       <span className="node-name">{name}</span>
//       <span className="node-points">
//         {points}/{maxPoints}
//       </span>
//     </div>
//   );
// };

// export default SkillNode;

import { useState, useEffect, useContext } from "react";
import styles from "./skill-node.styles.scss";
import SkillTooltipComponent from "../skill-tooltip/skill-tooltip.component.jsx";

const SkillNodeComponent = ({
  skill,
  isActive,
  points,
  onClick,
  onActivation,
  // nodeData,
  nodeSvgShape,
  rd3tProps,
}) => {
  const nodeData = rd3tProps;
  console.log("rd3tProps: " + rd3tProps);
  console.log("nodeData: " + nodeData);
  // const skill = nodeData.data;
  // const isActive = skill.allocatedPoints > 0;
  // const points = skill.allocatedPoints;

  useEffect(() => {
    console.log("rd3tProps: " + rd3tProps);
  }, []);

  const handleClick = (event) => {
    event.stopPropagation();
    onClick();
  };

  const handleActivation = (event) => {
    event.stopPropagation();
    onActivation();
  };

  return (
    <g>
      <SkillTooltipComponent skill={skill} points={points} isActive={isActive}>
        <circle
          className={isActive ? styles.activeNode : styles.inactiveNode}
          r={30}
          onClick={handleClick}
        />
      </SkillTooltipComponent>
      <text
        className={styles.skillName}
        x={0}
        y={50}
        textAnchor="middle"
        onClick={handleClick}
      >
        {skill.name}
      </text>
      {points > 0 && (
        <text
          className={styles.skillPoints}
          x={0}
          y={-40}
          textAnchor="middle"
          onClick={handleClick}
        >
          {points}
        </text>
      )}
      {isActive && (
        <circle
          className={styles.activationCircle}
          r={40}
          onClick={handleActivation}
        />
      )}
      <image
        href={skill.icon}
        x={-25}
        y={-25}
        height={50}
        width={50}
        onClick={handleClick}
      />
    </g>
  );
};

export default SkillNodeComponent;
