import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";

import classSelectionVideoBg from "../../assets/backgrounds/d4-class-selection-screen-loop-cut.webm";
import mouseLeftClickIcon from "../../assets/icons/mouse-icon-allocate.webp";
import mouseRightClickIcon from "../../assets/icons/mouse-icon-right-click.webp";
import "./class-menu.styles.scss";

const ClassMenu = () => {
  const { setSelectedClass } = useContext(ClassSelectionContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const handleClassSelect = (e, selectedClass) => {
    if (e.button === 0) {
      setSelectedClass(selectedClass);
    }
  };

  const handleClassOverview = (e, selectedClass) => {
    if (e.button === 2) {
      e.preventDefault();
      setSelectedClass(selectedClass);
      navigate(`/class-info/${selectedClass}`);
    }
  };

  return (
    <div className="class-container">
      <div className="content">
        {/* <div className="menu-title"></div> */}
        <ul className="class-menu">
          <li>
            <Link
              onMouseDown={(e) => handleClassSelect(e, "Barbarian")}
              onContextMenu={(e) => handleClassOverview(e, "Barbarian")}
              to="/skill-tree/Barbarian"
              className="class-menu-item"
              type="primary"
            >
              Barbarian
              <div className="class-button-help">
                <div className="class-select-container">
                  <img
                    className="mouse-icon left-click-icon"
                    src={mouseLeftClickIcon}
                    alt="Mouse left click icon"
                  />
                  <span>Select</span>
                </div>
                <div className="class-select-container">
                  <img
                    className="mouse-icon right-click-icon"
                    src={mouseRightClickIcon}
                    alt="Mouse right click icon"
                  />
                  <span>Overview</span>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link
              onMouseDown={(e) => handleClassSelect(e, "Necromancer")}
              onContextMenu={(e) => handleClassOverview(e, "Necromancer")}
              to="/skill-tree/Necromancer"
              className="class-menu-item "
              type="primary"
            >
              Necromancer
              <div className="class-button-help">
                <div className="class-select-container">
                  <img
                    className="mouse-icon left-click-icon"
                    src={mouseLeftClickIcon}
                    alt="Mouse left click icon"
                  />
                  <span>Select</span>
                </div>
                <div className="class-select-container">
                  <img
                    className="mouse-icon right-click-icon"
                    src={mouseRightClickIcon}
                    alt="Mouse right click icon"
                  />
                  <span>Overview</span>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link
              onMouseDown={(e) => handleClassSelect(e, "Sorcerer")}
              onContextMenu={(e) => handleClassOverview(e, "Sorcerer")}
              to="/skill-tree/Sorcerer"
              className="class-menu-item "
              type="primary"
            >
              Sorcerer
              <div className="class-button-help">
                <div className="class-select-container">
                  <img
                    className="mouse-icon left-click-icon"
                    src={mouseLeftClickIcon}
                    alt="Mouse left click icon"
                  />
                  <span>Select</span>
                </div>
                <div className="class-select-container">
                  <img
                    className="mouse-icon right-click-icon"
                    src={mouseRightClickIcon}
                    alt="Mouse right click icon"
                  />
                  <span>Overview</span>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link
              onMouseDown={(e) => handleClassSelect(e, "Rogue")}
              onContextMenu={(e) => handleClassOverview(e, "Rogue")}
              to="/skill-tree/Rogue"
              className="class-menu-item "
              type="primary"
            >
              Rogue
              <div className="class-button-help">
                <div className="class-select-container">
                  <img
                    className="mouse-icon left-click-icon"
                    src={mouseLeftClickIcon}
                    alt="Mouse left click icon"
                  />
                  <span>Select</span>
                </div>
                <div className="class-select-container">
                  <img
                    className="mouse-icon right-click-icon"
                    src={mouseRightClickIcon}
                    alt="Mouse right click icon"
                  />
                  <span>Overview</span>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link
              onMouseDown={(e) => handleClassSelect(e, "Druid")}
              onContextMenu={(e) => handleClassOverview(e, "Druid")}
              to="/skill-tree/Druid"
              className="class-menu-item "
              type="primary"
            >
              Druid
              <div className="class-button-help">
                <div className="class-select-container">
                  <img
                    className="mouse-icon left-click-icon"
                    src={mouseLeftClickIcon}
                    alt="Mouse left click icon"
                  />
                  <span>Select</span>
                </div>
                <div className="class-select-container">
                  <img
                    className="mouse-icon right-click-icon"
                    src={mouseRightClickIcon}
                    alt="Mouse right click icon"
                  />
                  <span>Overview</span>
                </div>
              </div>
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
