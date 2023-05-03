import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import ClassSelectionContext from "../../contexts/class-selection.context";

import "./dropdown.styles.scss";

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
];

const Dropdown = ({ onSelect }) => {
  const { selectedClass, setSelectedClass } = useContext(ClassSelectionContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedClass(option.label); // Update the context
    navigate(`/skill-tree/${option.value}`, { replace: true }); // Replace the current history entry
    toggleDropdown(); // Close the dropdown
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedClass || "Select a class"}
        <span className="dropdown-arrow"></span>
      </div>
      <CSSTransition
        in={isOpen}
        timeout={350}
        classNames="dropdown-menu-animation"
        unmountOnExit
      >
        <div className="dropdown-menu">
          {classOptions.map((option) => (
            <div
              key={option.value}
              className="dropdown-item"
              onClick={() => handleOptionSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </CSSTransition>
    </div>
  );
};

export default Dropdown;
