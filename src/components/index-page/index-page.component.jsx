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
        <div className="page-header"></div>
        <div className="menu-container">
          <div className="logo-container">
            <img src={logo} alt="Diablo IV" />
          </div>
          <div className="app-title">
            <h2>Build Calculator</h2>
          </div>
          <Link
            to="/class-menu"
            className="menu-item blz-button"
            type="primary"
          >
            Choose a class
          </Link>
          <Link to="/" className="menu-item blz-button" type="primary">
            Official Site
          </Link>
        </div>
      </div>
      <ParticlesComponent />
      {/* <div className="wp-container"></div> */}
    </div>
  );
};

export default IndexPage;
