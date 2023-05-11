import React from "react";
import { useNavigate } from "react-router-dom";

import "./home-button.styles.scss";

const HomeButton = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div className="home-button-container">
      <button className="d4-button home-button" onClick={navigateToHome}>
        Home
      </button>
    </div>
  );
};

export default HomeButton;
