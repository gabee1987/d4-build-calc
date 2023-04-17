import { React, useContext } from "react";
import { Link } from "react-router-dom";

import ClassSelectionContext from "../../contexts/class-selection.context";
import Dropdown from "../dropdown/dropdown.component";

import "./navbar-top.styles.scss";

const Navbar = () => {
  const { selectedClass, setSelectedClass } = useContext(ClassSelectionContext);

  const handleClassSelect = (selectedClass) => {
    console.log(`Selected class: ${selectedClass.label}`);
    setSelectedClass(selectedClass.label);
  };

  // Array of class options
  const classOptions = [
    {
      value: "barbarian",
      label: "Barbarian",
    },
    {
      value: "necromancer",
      label: "Necromancer",
    },
    {
      value: "sorcerer",
      label: "Sorcerer",
    },
    {
      value: "rogue",
      label: "Rogue",
    },
    {
      value: "druid",
      label: "Druid",
    },
    // Add more class options as needed
  ];

  return (
    <div className="navbar">
      <div className="navbar-center"></div>
      <Dropdown options={classOptions} onSelect={handleClassSelect} />
    </div>
  );
};

export default Navbar;
