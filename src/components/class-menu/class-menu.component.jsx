import React from "react";
import { Link } from "react-router-dom";
import "./class-menu.styles.scss";

const ClassMenu = () => {
  return (
    <div className="container">
      <h2>Select a class to start a build!</h2>
      <ul className="menu">
        <li>
          <Link to="/talent-tree/Barbarian" className="menuItem">
            Barbarian
          </Link>
        </li>
        <li>
          <Link to="/talent-tree/Druid" className="menuItem">
            Druid
          </Link>
        </li>
        <li>
          <Link to="/talent-tree/Necromancer" className="menuItem">
            Necromancer
          </Link>
        </li>
        <li>
          <Link to="/talent-tree/Rogue" className="menuItem">
            Rogue
          </Link>
        </li>
        <li>
          <Link to="/talent-tree/Sorcerer" className="menuItem">
            Sorcerer
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ClassMenu;
