import { React, useContext, useState } from "react";

import ClassSelectDropdown from "../class-select-dropdown/class-select-dropdown.component";
import ResetButton from "../reset-button/reset-button.component";
import SearchComponent from "../search/search.component.jsx";

import ShareButton from "../share-button/share-button.component";
import HomeButton from "../home-button/home-button.component";

import ClassSelectionContext from "../../contexts/class-selection.context";

import "./navbar-top.styles.scss";

const Navbar = ({
  nodes,
  links,
  svg,
  nodeGroup,
  setResetStatus,
  toggleBuildProfiles,
  toggleClassInfo,
  toggleSearchInfo,
  handleSearch,
  treeGroupRef,
  setHighlightedNodes,
}) => {
  const { selectedClass } = useContext(ClassSelectionContext);

  return (
    <div className="navbar">
      <div className="navbar-center"></div>
      <div className="navbar-left-button-container">
        <HomeButton />
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
      <div className="navbar-right-button-container">
        <button
          className="d4-button build-profiles-button"
          onClick={toggleBuildProfiles}
        >
          Builds
        </button>
        <ShareButton />
        <button
          className="d4-button class-info-button"
          onClick={toggleClassInfo}
        >
          Class Details
        </button>
        <SearchComponent
          onSearch={handleSearch(nodes, treeGroupRef, setHighlightedNodes)}
        />
        <button className="search-info-button" onClick={toggleSearchInfo}>
          <strong>i</strong>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
