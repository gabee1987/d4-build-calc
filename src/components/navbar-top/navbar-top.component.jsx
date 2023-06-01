import { React, useContext, useState } from "react";

import ClassSelectDropdown from "../class-select-dropdown/class-select-dropdown.component";
import ResetButton from "../reset-button/reset-button.component";

import SearchComponent from "../search/search.component.jsx";
import ShareButton from "../share-button/share-button.component";
import HomeButton from "../home-button/home-button.component";
import CodexDropdown from "../codex-dropdown/codex-dropdown.component";

import ClassSelectionContext from "../../contexts/class-selection.context";

import "./navbar-top.styles.scss";

const Navbar = ({
  nodes,
  links,
  svg,
  nodeGroup,
  setResetStatus,
  toggleBuildProfiles,
  toggleCodex: toggleCodex,
  toggleSearchInfo,
  handleSearch,
  treeGroupRef,
  setHighlightedNodes,
}) => {
  const { selectedClass } = useContext(ClassSelectionContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="navbar">
      <button className="navbar-mobile-menu" onClick={handleToggleMobileMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div className="navbar-center"></div>
      <div
        className={`navbar-left-button-container ${
          isMobileMenuOpen ? "show" : ""
        }`}
      >
        <HomeButton />
        <CodexDropdown toggleClassInfo={toggleCodex} />
      </div>
      <div className="navbar-center-button-container">
        <ClassSelectDropdown />
        <ResetButton
          nodes={nodes}
          links={links}
          svg={svg}
          nodeGroup={nodeGroup}
          setResetStatus={setResetStatus}
        />
      </div>
      <div
        className={`navbar-right-button-container ${
          isMobileMenuOpen ? "show" : ""
        }`}
      >
        <button
          className="d4-button build-profiles-button"
          onClick={toggleBuildProfiles}
        >
          Builds
        </button>
        <ShareButton />
        <SearchComponent
          onSearch={handleSearch(nodes, treeGroupRef, setHighlightedNodes)}
        />
        <button
          className="d4-button-mini search-info-button"
          onClick={toggleSearchInfo}
        >
          <strong>i</strong>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
