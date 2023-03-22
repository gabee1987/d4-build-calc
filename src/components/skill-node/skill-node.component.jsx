import React from "react";

const SkillNode = ({ node, onClick }) => {
  const { id, name, points, maxPoints } = node;
  return (
    <div className="skill-node" id={id} onClick={onClick}>
      <span className="node-name">{name}</span>
      <span className="node-points">
        {points}/{maxPoints}
      </span>
    </div>
  );
};

export default SkillNode;
