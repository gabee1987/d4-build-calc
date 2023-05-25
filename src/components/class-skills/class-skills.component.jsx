import React, { useContext, useEffect, useState } from "react";

import Skill from "../skill/skill.component.jsx";
import { loadSkills } from "../../helpers/codex/class-skills-loader.js";

import classIconBarbarian from "../../assets/icons/class-icon-barbarian.webp";
import classIconNecromancer from "../../assets/icons/class-icon-necromancer.webp";
import classIconSorcerer from "../../assets/icons/class-icon-sorcerer.webp";
import classIconRogue from "../../assets/icons/class-icon-rogue.webp";
import classIconDruid from "../../assets/icons/class-icon-druid.webp";

import "./class-skills.styles.scss";

const ClassSkillsComponent = () => {
  const [skills, setSkills] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const classes = ["Barbarian", "Necromancer", "Sorcerer", "Rogue", "Druid"];

  const classIcons = {
    Barbarian: classIconBarbarian,
    Necromancer: classIconNecromancer,
    Sorcerer: classIconSorcerer,
    Rogue: classIconRogue,
    Druid: classIconDruid,
  };

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
    <div className="class-skill-page">
      <div className="class-skills-navbar">
        <div className="class-skill-nav-left">
          <div className="class-skills-title-container">
            <h2>Diablo 4 Class Skills</h2>
          </div>
        </div>
        <div className="class-skill-nav-right"></div>
      </div>
      <div className="class-skills-container">
        <div className="class-skills-content">
          <div className="class-skills-header-container"></div>
          <div className="class-skills-header-container-center"></div>
          <div className="class-skills-content-bg-container"></div>
          <div className="class-skills-class-selection inner-panel">
            <ul className="class-skills-class-list">
              {classes.map((className, index) => (
                <li
                  key={index}
                  onClick={() => handleClassFilter(className)}
                  className={
                    selectedClasses.includes(className) ? "class-selected" : ""
                  }
                >
                  <img src={classIcons[className]} alt={className} />
                  {className}
                </li>
              ))}
            </ul>
          </div>
          <div className="class-skills-skill-list-container inner-panel">
            <ul>{renderSkills()}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSkillsComponent;
