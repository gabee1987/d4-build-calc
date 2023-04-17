import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";

import SkillTreeComponent from "../skill-tree/skill-tree.component.jsx";
import "./skill-calculator.styles.scss";

import sorcererData from "../../data/sorcerer.json";

const SkillCalculator = () => {
  const { className } = useParams();
  const { selectedClass, setSelectedClass } = useContext(ClassSelectionContext);

  const [allocatedPoints, setAllocatedPoints] = useState({});
  const [skillTreeData, setSkillTreeData] = useState(sorcererData);

  // Set the selected class based on the URL parameter
  useEffect(() => {
    if (!selectedClass && className) {
      setSelectedClass(className);
    }
  }, [selectedClass, className, setSelectedClass]);

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
