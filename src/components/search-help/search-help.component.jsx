import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import separatorFrame from "../../assets/frames/separator-frame-2.webp";
import "./search-help.styles.scss";

const SearchHelpComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="search-help">
      <button onClick={toggleHelp}>i</button>
      <CSSTransition
        in={isOpen}
        timeout={350}
        classNames="search-help-content-animation"
        unmountOnExit
      >
        <div className={`search-help-content`}>
          <div className="search-help-content-bg-container"></div>
          <div className="search-help-title-container">
            <h4>Search Instructions</h4>
          </div>
          <div className="search-help-general-container">
            <ul>
              <li>
                <div className="separator">
                  <img src={separatorFrame} alt="" />
                </div>
                <span>
                  Type one or more keywords separated by spaces to search for
                  nodes that contain all the keywords.
                </span>
              </li>
              <li>
                <span>
                  You can search keywords for any kinds of information about the
                  skills, such as name, type, tags, description, dmg numbers,
                  allocated points etc.
                </span>
              </li>
              <li>
                <span>
                  You can also use special search keywords to search for
                  specific attributes in the nodes.
                </span>
              </li>
            </ul>
          </div>

          <div className="search-help-keywords-title-container">
            <h4>Search Keywords</h4>
          </div>
          <div className="search-help-keywords-container">
            <ul>
              <li>
                <div className="separator">
                  <img src={separatorFrame} alt="" />
                </div>
                <span>
                  <strong>p:N</strong> - Search for nodes that have N allocated
                  points (e.g., "p:3" for nodes with 3 allocated points).
                </span>
              </li>
              <li>
                <span>
                  <strong>n:keyword</strong> - Search for nodes that have points
                  (e.g., "p:3" for nodes with 3 allocated points).
                </span>
              </li>
              <li>
                <span>
                  <strong>T:keyword</strong> - Search for nodes that have N
                  allocated points (e.g., "p:3" for nodes with 3 allocated
                  points).
                </span>
              </li>
              <li>
                <span>
                  <strong>mp:N</strong> - Search for nodes that have N allocated
                  points (e.g., "p:3" for nodes with 3 allocated points).
                </span>
              </li>
              <li>
                <span>
                  <strong>nt:N</strong> - Search for nodes that have N allocated
                  points (e.g., "p:3" for nodes with 3 allocated points).
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
