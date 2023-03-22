import React from "react";
import { Link } from "react-router-dom";
import "./class-menu.styles.scss";
import logo from "../../assets/d4-logo-002.webp";

const ClassMenu = () => {
  return (
    <div className="container">
      <div className="page-header">
        <img src={logo} alt="Diablo IV" />
        <div className="page-title">
          <h2>Skill Calculator</h2>
        </div>
      </div>
      <div className="menu-title">
        <h2>Select a class to start a build!</h2>
      </div>
      <ul className="menu">
        <li>
          <Link
            to="/talent-tree/Barbarian"
            className="menu-item blz-button"
            type="primary"
          >
            Barbarian
          </Link>
        </li>
        <li>
          <Link
            to="/talent-tree/Druid"
            className="menu-item blz-button"
            type="primary"
          >
            Druid
          </Link>
        </li>
        <li>
          <Link
            to="/talent-tree/Necromancer"
            className="menu-item blz-button"
            type="primary"
          >
            Necromancer
          </Link>
        </li>
        <li>
          <Link
            to="/talent-tree/Rogue"
            className="menu-item blz-button"
            type="primary"
          >
            Rogue
          </Link>
        </li>
        <li>
          <Link
            to="/talent-tree/Sorcerer"
            className="menu-item blz-button"
            type="primary"
          >
            Sorcerer
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ClassMenu;
