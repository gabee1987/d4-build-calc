import React, { useContext, useEffect, useState } from "react";

import Skill from "../skill/skill.component.jsx";
import { loadSkills } from "../../helpers/codex/class-skills-loader.js";

import "./class-skills.styles.scss";

const ClassSkillsComponent = () => {
  const [skills, setSkills] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const classes = ["Barbarian", "Necromancer", "Sorcerer", "Rogue", "Druid"];

  useEffect(() => {
    let activeSkills = loadSkills();
    setSkills(activeSkills);
  }, []);

  const handleClassFilter = (className) => {
    setSelectedClasses((prevClasses) => {
      return prevClasses.includes(className)
        ? prevClasses.filter((classItem) => classItem !== className)
        : [...prevClasses, className];
    });
  };

  const renderSkills = () => {
    if (selectedClasses.length === 0) {
      return skills.map((skill) => <Skill key={skill.id} data={skill} />);
    }

    return skills
      .filter((skill) => selectedClasses.includes(skill.class))
      .map((skill) => <Skill key={skill.id} data={skill} />);
  };

  return (
    <div className="class-skills-container">
      <div className="class-skills-title-container">
        <h1>Diablo 4 Class Skills</h1>
      </div>
      <div className="class-skills-content">
        <div className="class-skills-class-selection">
          <ul>
            {classes.map((className, index) => (
              <li key={index} onClick={() => handleClassFilter(className)}>
                {className}{" "}
                {selectedClasses.includes(className) ? "(selected)" : ""}
              </li>
            ))}
          </ul>
        </div>
        <div className="class-skills-skill-list-container">
          <ul>{renderSkills()}</ul>
        </div>
      </div>
    </div>
  );
};

export default ClassSkillsComponent;
