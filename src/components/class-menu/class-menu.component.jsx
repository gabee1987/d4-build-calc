import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";

import { generateSkillTreeUrl } from "../../helpers/skill-tree/state-management-utils";

import classSelectionVideoBg from "../../assets/backgrounds/d4-class-selection-screen-loop-cut.webm";
import "./class-menu.styles.scss";

const ClassMenu = () => {
  const { selectedClass, setSelectedClass } = useContext(ClassSelectionContext);
  const navigate = useNavigate();

  const handleClassSelect = (selectedClass) => {
    console.log(`Selected class: ${selectedClass}`);
    setSelectedClass(selectedClass);
    // Generate an initial skill tree URL for the selected class
    const initialSkillTreeUrl = generateSkillTreeUrl(selectedClass, []);
    console.log("url -> ", initialSkillTreeUrl);
    // Navigate to the generated URL
    navigate(initialSkillTreeUrl);
  };

  return (
    <div className="class-container">
      <div className="content">
        <div className="menu-title">
          {/* <h2>Select a class to start a build!</h2> */}
        </div>
        <ul className="menu">
          <li>
            <button
              onClick={() => handleClassSelect("Barbarian")}
              className="menu-item blz-button"
              type="primary"
            >
              Barbarian
            </button>
          </li>
          <li>
            <button
              onClick={() => handleClassSelect("Necromancer")}
              className="menu-item blz-button"
              type="primary"
            >
              Necromancer
            </button>
          </li>
          <li>
            <button
              onClick={() => handleClassSelect("Sorcerer")}
              className="menu-item blz-button"
              type="primary"
            >
              Sorcerer
            </button>
          </li>
          <li>
            <button
              onClick={() => handleClassSelect("Rogue")}
              className="menu-item blz-button"
              type="primary"
            >
              Rogue
            </button>
          </li>
          <li>
            <button
              onClick={() => handleClassSelect("Druid")}
              className="menu-item blz-button"
              type="primary"
            >
              Druid
            </button>
          </li>
        </ul>
      </div>
      {/* <ParticlesComponent /> */}
      <video
        className="video-background"
        autoPlay
        loop
        muted
        poster="../../assets/backgrounds/d4-char-select-sorcerer-uw.webp"
      >
        <source src={classSelectionVideoBg} type="video/mp4" />
      </video>
    </div>
  );
};

export default ClassMenu;
