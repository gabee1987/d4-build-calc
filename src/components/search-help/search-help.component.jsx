import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import separatorFrame from "../../assets/frames/separator-frame-2.webp";
import "./search-help.styles.scss";

const SearchHelpComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  // CSSTransition "findDOMNode is deprecated in StrictMode" exception fix/workaround
  const nodeRef = React.useRef(null);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="search-help">
      <button className="search-info-button" onClick={toggleHelp}>
        <strong>i</strong>
      </button>
      <CSSTransition
        in={isOpen}
        timeout={350}
        classNames="search-help-content-animation"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className={`search-help-content`}>
          <div className="search-help-content-bg-container"></div>
          <div className="search-help-title-container">
            <h4>Search Instructions</h4>
          </div>
          <div className="search-help-general-container">
            <ul>
              <li>
                {/* <div className="separator">
                  <img src={separatorFrame} alt="" />
                </div> */}
                <span>
                  The search feature allows you to easily find skills based on
                  various information, such as name, type, tag, description,
                  damage numbers, allocated points, and more. Simply type your
                  search terms into the search box, and the matching skills will
                  be highlighted.
                </span>
              </li>
            </ul>
          </div>

          <div className="search-help-keywords-title-container">
            <h4>Special Keywords</h4>
          </div>

          <div className="search-help-keywords-container">
            <ul>
              <li>
                <div className="separator">
                  <img src={separatorFrame} alt="" />
                </div>
                <span>
                  You can also use special keywords to search for specific
                  information:
                </span>
              </li>
              <li>
                <span>
                  <strong>Allocated Points</strong>
                  <br></br>
                  Use <strong>p:</strong> followed by a number to search for
                  nodes with a specific number of allocated points. Example: p:3
                </span>
              </li>
              <li>
                <span>
                  <strong>Skill Name</strong>
                  <br></br>
                  Use <strong>n:</strong> followed by the skill name to search
                  only within skill names. Example: n:Frenzy
                </span>
              </li>
              <li>
                <span>
                  <strong>Tags </strong>
                  <br></br>
                  Use <strong>t:</strong> followed by a tag name to search only
                  within tags. Example: t:Chill
                </span>
              </li>
              <li>
                <span>
                  <strong>Max Points</strong>
                  <br></br>
                  Use <strong>mp:</strong> followed by a number to search for
                  nodes with a specific max points value. Example: mp:5
                </span>
              </li>
              <li>
                <span>
                  <strong>Node Type</strong>
                  <br></br>
                  Use <strong>nt:</strong> followed by the node type to search
                  for specific node types. Example: nt:activeSkill
                </span>
              </li>
              <li>
                <span>
                  Available node types are: activeSkill, activeSkillBuff,
                  activeSkillUpgrade, passiveSkill, and capstoneSkill.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default SearchHelpComponent;
