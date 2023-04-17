import React, { useState } from "react";
import { useParams } from "react-router-dom";

import SkillTreeComponent from "../skill-tree/skill-tree.component.jsx";
import "./skill-calculator.styles.scss";

import sorcererData from "../../data/sorcerer.json";

const SkillCalculator = () => {
  const { className } = useParams();
  const [allocatedPoints, setAllocatedPoints] = useState({});
  const [skillTreeData, setSkillTreeData] = useState(sorcererData);

  return (
    <div className="page-container">
      <SkillTreeComponent
        skillData={skillTreeData}
        allocatedPoints={allocatedPoints}
      />
    </div>
  );
};

export default SkillCalculator;
