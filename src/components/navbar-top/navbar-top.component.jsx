import { React, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import ClassSelectionContext from "../../contexts/class-selection.context";
import { SkillTreeContext } from "../../contexts/skill-tree-state-management.context.jsx";

import Dropdown from "../dropdown/dropdown.component";

import "./navbar-top.styles.scss";

const Navbar = () => {
  const { selectedClass, setSelectedClass } = useContext(ClassSelectionContext);
  const { resetSkillTree } = useContext(SkillTreeContext);
  const navigate = useNavigate();

  const handleClassSelect = (selectedClass) => {
    console.log(`Selected class: ${selectedClass.label}`);
    setSelectedClass(selectedClass.label);
    navigate(`/skill-tree/${selectedClass.label}`);
  };

  const handleReset = () => {
    resetSkillTree(selectedClass);
    navigate(`/skill-tree/${selectedClass}`, { replace: true });
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
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Navbar;
