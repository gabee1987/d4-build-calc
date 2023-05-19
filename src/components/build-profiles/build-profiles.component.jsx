import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

import separatorFrame from "../../assets/frames/separator-frame-2.webp";

import "./build-profiles.styles.scss";

const BuildProfiles = ({ isOpen, toggleBuildProfiles }) => {
  const [inputValue, setInputValue] = useState("");
  const [buildProfiles, setBuildProfiles] = useState([]);
  // const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // CSSTransition "findDOMNode is deprecated in StrictMode" exception fix/workaround
  const nodeRef = React.useRef(null);

  useEffect(() => {
    if (isOpen === false) {
      setErrorMessage("");
      setInputValue("");
    }
  }, [isOpen]);

  const loadBuildProfiles = () => {
    const profiles = JSON.parse(localStorage.getItem("buildProfiles")) || [];
    setBuildProfiles(profiles);
  };

  const handleSave = () => {
    // Check if the input is empty
    if (!inputValue.trim()) {
      setErrorMessage("The build name cannot be empty. Please enter a name.");
      return;
    }

    // Check if a build with the same name already exists
    const existingBuild = buildProfiles.find(
      (profile) => profile.name === inputValue
    );

    // Show an error message or prompt the user to confirm the overwrite
    if (existingBuild) {
      setErrorMessage(
        "A build with the same name already exists. Please choose a different name."
      );
    } else {
      // TODO need to fix the path navigating, until that a full url link will do
      //   const path = window.location.pathname + window.location.search;
      const newProfiles = [
        ...buildProfiles,
        { name: inputValue, url: window.location.href },
      ];
      localStorage.setItem("buildProfiles", JSON.stringify(newProfiles));
      setInputValue("");
      setErrorMessage("");
      // Update the buildProfiles state with the new build
      setBuildProfiles(newProfiles);
    }
  };

  const handleClearName = () => {
    setInputValue("");
  };

  const handleLoad = (url) => {
    // navigate
    // console.log("navigated to ", url);
    // navigate(url);
    // TODO need to fix the path navigating later, right now a default link will be good
  };

  const handleDelete = (profileToDelete) => {
    const updatedProfiles = buildProfiles.filter(
      (profile) => profile.name !== profileToDelete.name
    );
    localStorage.setItem("buildProfiles", JSON.stringify(updatedProfiles));
    setBuildProfiles(updatedProfiles);
  };

  useEffect(() => {
    loadBuildProfiles();
  }, []);

  return (
    <div className="build-profiles">
      <CSSTransition
        in={isOpen}
        timeout={350}
        classNames="build-profiles-content-animation"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className="build-profiles-content">
          <button
            className="panel-close-button build-profiles-close-button"
            onClick={toggleBuildProfiles}
          ></button>
          <div className="build-profiles-title-container">
            <h2>Save/Load Builds</h2>
          </div>
          <div className="build-profiles-inner-content">
            <div className="build-profiles-name-container">
              <input
                className="build-profiles-name-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  }
                }}
                placeholder="Enter build name"
                list="buildProfiles"
                maxLength={30}
              />
              {inputValue && (
                <button className="clear-search" onClick={handleClearName}>
                  &times;
                </button>
              )}
              {/* <datalist id="buildProfiles">
                {buildProfiles.map((profile) => (
                  <option key={profile.name} value={profile.name} />
                ))}
              </datalist> */}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <button
              className="d4-button save-build-button"
              onClick={handleSave}
            >
              Save
            </button>
            <div className="build-profiles-saved-builds-title-container">
              <h3>Saved Builds</h3>
              <div className="build-profiles-separator">
                <img src={separatorFrame} alt="" />
              </div>
            </div>
            <div className="build-profiles-list-container">
              <ul className="build-profiles-list">
                {buildProfiles.map((profile) => (
                  <li key={profile.name}>
                    <div className="list-item-container">
                      <a
                        href={profile.url}
                        onClick={(e) => {
                          // TODO need to fix the path navigating, until that a normal link navigate will do
                          //   e.preventDefault();
                          //   handleLoad(profile.url);
                        }}
                      >
                        {profile.name}
                      </a>
                      <button
                        className="delete-build-button"
                        onClick={() => handleDelete(profile)}
                      >
                        <svg
                          viewBox="0 -8 40 40"
                          aria-hidden="true"
                          focusable="false"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          className="trashcan-icon"
                        >
                          <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="build-profiles-content-bg-container"></div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default BuildProfiles;
