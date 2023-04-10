import React from "react";
import { Link } from "react-router-dom";
import { useCallback } from "react";

import ParticlesComponent from "../particles/particles.component";

import logo from "../../assets/Diablo_IV_Logo_small.webp";
import classSelectionVideoBg from "../../assets/backgrounds/d4-class-selection-screen-loop-cut.webm";
import "./class-menu.styles.scss";

const ClassMenu = () => {
  return (
    <div className="class-container">
      <div className="content">
        <div className="menu-title">
          {/* <h2>Select a class to start a build!</h2> */}
        </div>
        <ul className="menu">
          <li>
            <Link
              to="/skill-tree/Barbarian"
              className="menu-item blz-button"
              type="primary"
            >
              Barbarian
            </Link>
          </li>
          <li>
            <Link
              to="/skill-tree/Druid"
              className="menu-item blz-button"
              type="primary"
            >
              Druid
            </Link>
          </li>
          <li>
            <Link
              to="/skill-tree/Necromancer"
              className="menu-item blz-button"
              type="primary"
            >
              Necromancer
            </Link>
          </li>
          <li>
            <Link
              to="/skill-tree/Rogue"
              className="menu-item blz-button"
              type="primary"
            >
              Rogue
            </Link>
          </li>
          <li>
            <Link
              to="/skill-tree/Sorcerer"
              className="menu-item blz-button"
              type="primary"
            >
              Sorcerer
            </Link>
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
