import React, { useEffect, useState, useRef, useContext } from "react";
import { CSSTransition } from "react-transition-group";

import ClassSelectionContext from "../../contexts/class-selection.context";

import "./class-info-dropdown.styles.scss";

const ClassInfoDropdown = ({ onSelect }) => {
  const { selectedClass } = useContext(ClassSelectionContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    toggleDropdown();
  };
  return (
    <div className="class-info-dropdown" ref={dropdownRef}>
      <div className="class-info-dropdown-toggle" onClick={toggleDropdown}>
        Class Info
        <span className="dropdown-arrow"></span>
      </div>
      <CSSTransition
        in={isOpen}
        timeout={350}
        classNames="dropdown-menu-animation"
        unmountOnExit
      >
        <div className="class-select-dropdown-menu">
          <div className="class-info-dropdown-item">Class Overview</div>
          <div className="class-info-dropdown-item">Skill List</div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default ClassInfoDropdown;
