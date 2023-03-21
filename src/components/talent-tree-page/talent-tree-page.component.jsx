import React from "react";
import { useParams } from "react-router-dom";
import SkillTreeComponent from "../skill-tree/skill-tree.component.jsx";
import "./talent-tree-page.style.scss";

const TalentTreePage = () => {
  const { className } = useParams();

  return (
    <div>
      <h1>{className} Skill Tree</h1>
      <SkillTreeComponent />
    </div>
  );
};

export default TalentTreePage;
