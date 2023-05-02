import { React, useContext } from "react";

import Dropdown from "../dropdown/dropdown.component";
import ResetButton from "../reset-button/reset-button.component";
import ClassInfo from "../class-info/class-info.component.jsx";
import SearchComponent from "../search/search.component.jsx";
import SearchHelpComponent from "../search-help/search-help.component";

import ClassSelectionContext from "../../contexts/class-selection.context";

import "./navbar-top.styles.scss";

const Navbar = ({
  nodes,
  links,
  svg,
  nodeGroup,
  setResetStatus,
  infoPanelVisible,
  setInfoPanelVisible,
  handleSearch,
  treeGroupRef,
  setHighlightedNodes,
}) => {
  const { selectedClass } = useContext(ClassSelectionContext);

  return (
    <div className="navbar">
      <div className="navbar-center"></div>
      <Dropdown />
      <ResetButton
        nodes={nodes}
        links={links}
        svg={svg}
        nodeGroup={nodeGroup}
        setResetStatus={setResetStatus}
      />
      <ClassInfo
        selectedClass={selectedClass}
        className={`class-info ${infoPanelVisible ? "show" : ""}`}
      />
      <SearchComponent
        onSearch={handleSearch(nodes, treeGroupRef, setHighlightedNodes)}
      />
      <SearchHelpComponent />
    </div>
  );
};

export default Navbar;
