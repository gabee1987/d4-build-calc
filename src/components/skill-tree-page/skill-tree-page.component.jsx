import React from "react";
import { useParams } from "react-router-dom";
import SkillTreeComponent from "../skill-tree/skill-tree.component.jsx";
import "./skill-tree-page.style.scss";

const SkillTreePage = () => {
  const { className } = useParams();

  return (
    <div>
      <h1>{className} Skill Tree</h1>
      <SkillTreeComponent />
    </div>
  );
};

export default SkillTreePage;
