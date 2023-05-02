import { React, useContext } from "react";
import Dropdown from "../dropdown/dropdown.component";
import ResetButton from "../reset-button/reset-button.component";

import "./navbar-top.styles.scss";

const Navbar = ({ nodes, links, svg, nodeGroup, setResetStatus }) => {
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
    </div>
  );
};

export default Navbar;
