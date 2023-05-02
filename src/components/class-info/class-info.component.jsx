import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import separatorFrame from "../../assets/frames/separator-frame-2.webp";
import classDescriptions from "../../data/all-class-descriptions.json";

// Class icons
import sorcererFrostIcon from "../../assets/icons/sorcerer-frost-icon.webp";
import sorcererFireIcon from "../../assets/icons/sorcerer-fire-icon.webp";
import sorcererShockIcon from "../../assets/icons/sorcerer-shock-icon.webp";
import necromancerUndeadArmyIcon from "../../assets/icons/necromancer-undeadarmy-icon.webp";
import necromancerBoneIcon from "../../assets/icons/necromancer-bone-icon.webp";
import necromancerDarknessIcon from "../../assets/icons/necromancer-darkness-icon.webp";
import necromancerBloodIcon from "../../assets/icons/necromancer-blood-icon.webp";

import "./class-info.styles.scss";

const iconMap = {
  // Necromancer
  "necromancer-undeadarmy-icon.webp": necromancerUndeadArmyIcon,
  "necromancer-bone-icon.webp": necromancerBoneIcon,
  "necromancer-darkness-icon.webp": necromancerDarknessIcon,
  "necromancer-blood-icon.webp": necromancerBloodIcon,
  // Sorcerer
  "sorcerer-frost-icon.webp": sorcererFrostIcon,
  "sorcerer-fire-icon.webp": sorcererFireIcon,
  "sorcerer-shock-icon.webp": sorcererShockIcon,
};

const getIconSrc = (iconName) => {
  return iconMap[iconName];
};

const ClassInfo = ({ selectedClass }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleInfo = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="class-info">
      <button className="class-info-button" onClick={toggleInfo}>
        Class Details
      </button>
      <CSSTransition
        in={isOpen}
        timeout={350}
        classNames="class-info-content-animation"
        unmountOnExit
      >
        <div className={`class-info-content`}>
          <div className="class-info-content-bg-container"></div>
          <div className="class-info-title-container">
            <h4>{selectedClass}</h4>
          </div>
          <div className="class-info-general-container">
            <ul>
              <li>
                <span>
                  {selectedClass && classDescriptions[selectedClass].main}
                </span>
              </li>
            </ul>
          </div>

          <div className="class-info-keywords-container">
            <ul>
              {selectedClass &&
                classDescriptions[selectedClass].details.map(
                  (detail, index) => (
                    <li key={index}>
                      <img
                        src={getIconSrc(detail.icon)}
                        alt={`${detail.title} icon`}
                      />
                      <div className="class-info-detail-container">
                        <div className="detail-title">{detail.title}</div>
                        <div className="detail-description">
                          {detail.description}
                        </div>
                      </div>
                    </li>
                  )
                )}
            </ul>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default ClassInfo;
