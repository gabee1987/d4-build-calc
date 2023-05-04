import React, { useContext } from "react";
import { Link } from "react-router-dom";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";

import classSelectionVideoBg from "../../assets/backgrounds/d4-class-selection-screen-loop-cut.webm";
import "./class-menu.styles.scss";

const ClassMenu = () => {
  const { setSelectedClass } = useContext(ClassSelectionContext);

  const handleClassSelect = (selectedClass) => {
    console.log(`Selected class: ${selectedClass}`);
    setSelectedClass(selectedClass);
  };

  return (
    <div className="class-container">
      <div className="content">
        {/* <div className="menu-title"></div> */}
        <ul className="menu">
          <li>
            <Link
              onClick={() => handleClassSelect("Barbarian")}
              to="/skill-tree/Barbarian"
              className="menu-item blz-button"
              type="primary"
            >
              Barbarian
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleClassSelect("Necromancer")}
              to="/skill-tree/Necromancer"
              className="menu-item blz-button"
              type="primary"
            >
              Necromancer
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleClassSelect("Sorcerer")}
              to="/skill-tree/Sorcerer"
              className="menu-item blz-button"
              type="primary"
            >
              Sorcerer
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleClassSelect("Rogue")}
              to="/skill-tree/Rogue"
              className="menu-item blz-button"
              type="primary"
            >
              Rogue
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleClassSelect("Druid")}
              to="/skill-tree/Druid"
              className="menu-item blz-button"
              type="primary"
            >
              Druid
            </Link>
          </li>
        </ul>
      </div>
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
