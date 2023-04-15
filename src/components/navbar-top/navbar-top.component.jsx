import React from "react";
import { Link } from "react-router-dom";

import Dropdown from "../dropdown/dropdown.component";
import "./navbar-top.styles.scss";

const Navbar = () => {
  // Array of class options
  const classOptions = [
    {
      value: "barbarian",
      label: "Barbarian",
      imageUrl: "https://example.com/barbarian.png",
    },
    {
      value: "sorceress",
      label: "Sorceress",
      imageUrl: "https://example.com/sorceress.png",
    },
    {
      value: "druid",
      label: "Druid",
      imageUrl: "https://example.com/druid.png",
    },
    // Add more class options as needed
  ];

  const handleClassSelect = (selectedClass) => {
    // Handle class selection here
    console.log(`Selected class: ${selectedClass.label}`);
  };

  return (
    <div className="navbar">
      <div className="navbar-center"></div>
      <Dropdown options={classOptions} onSelect={handleClassSelect} />
      {/* <Link
        to="/skill-tree/Barbarian"
        className="menu-item blz-button"
        type="primary"
      >
        Barbarian
      </Link> */}
    </div>
  );
};

export default Navbar;
