import React from "react";
import { Link } from "react-router-dom";
import { useCallback } from "react";

import ParticlesComponent from "../particles/particles.component";

import logo from "../../assets/logos/Diablo_IV_Logo_small.webp";
import "./index-page.styles.scss";

const IndexPage = () => {
  return (
    <div className="index-page-container">
      <div className="index-content">
        <div className="page-header">
          <img src={logo} alt="Diablo IV" />
          <div className="page-title">
            <h2>Build Calculator</h2>
          </div>
        </div>
        <div className="button-menu-container">
          <Link
            to="/class-menu"
            className="menu-item blz-button"
            type="primary"
          >
            Choose a class
          </Link>
        </div>
      </div>
      <ParticlesComponent />
      {/* <div className="wp-container"></div> */}
    </div>
  );
};

export default IndexPage;
