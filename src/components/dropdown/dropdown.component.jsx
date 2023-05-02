import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
      {isOpen && (
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
      )}
    </div>
  );
};

export default Dropdown;
