import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";

import classSelectionVideoBg from "../../assets/backgrounds/d4-class-selection-screen-loop-cut.webm";
import "./class-menu.styles.scss";

const ClassMenu = () => {
  const { setSelectedClass } = useContext(ClassSelectionContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleClassSelect = (selectedClass) => {
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
              className="menu-item "
              type="primary"
            >
              Barbarian
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleClassSelect("Necromancer")}
              to="/skill-tree/Necromancer"
              className="menu-item "
              type="primary"
            >
              Necromancer
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleClassSelect("Sorcerer")}
              to="/skill-tree/Sorcerer"
              className="menu-item "
              type="primary"
            >
              Sorcerer
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleClassSelect("Rogue")}
              to="/skill-tree/Rogue"
              className="menu-item "
              type="primary"
            >
              Rogue
            </Link>
          </li>
          <li>
            <Link
              onClick={() => handleClassSelect("Druid")}
              to="/skill-tree/Druid"
              className="menu-item "
              type="primary"
            >
              Druid
            </Link>
          </li>
        </ul>
      </div>
      {windowWidth >= 1030 && (
        <video
          className="video-background"
          autoPlay
          loop
          muted
          poster="../../assets/backgrounds/lilith-silhouette-bg-small.webp"
        >
          <source src={classSelectionVideoBg} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default ClassMenu;
