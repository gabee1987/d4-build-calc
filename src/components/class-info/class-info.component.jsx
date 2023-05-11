import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import classDescriptions from "../../data/all-class-descriptions.json";

// Class icons
// Barbarian
import classIconBarbarian from "../../assets/icons/class-icon-barbarian.webp";
import barbarianBerserkingIcon from "../../assets/icons/barbarian-berserking-icon.webp";
import barbarianBleedIcon from "../../assets/icons/barbarian-bleed-icon.webp";
import barbarianWalkingArsenalIcon from "../../assets/icons/barbarian-walkingarsenal-icon.webp";
import barbarianUnbridledRageIcon from "../../assets/icons/barbarian-unbridledrage-icon.webp";
// Necromancer
import classIconNecromancer from "../../assets/icons/class-icon-necromancer.webp";
import necromancerUndeadArmyIcon from "../../assets/icons/necromancer-undeadarmy-icon.webp";
import necromancerBoneIcon from "../../assets/icons/necromancer-bone-icon.webp";
import necromancerDarknessIcon from "../../assets/icons/necromancer-darkness-icon.webp";
import necromancerBloodIcon from "../../assets/icons/necromancer-blood-icon.webp";
// Sorcerer
import classIconSorcerer from "../../assets/icons/class-icon-sorcerer.webp";
import sorcererFrostIcon from "../../assets/icons/sorcerer-frost-icon.webp";
import sorcererFireIcon from "../../assets/icons/sorcerer-fire-icon.webp";
import sorcererShockIcon from "../../assets/icons/sorcerer-shock-icon.webp";
// Rogue
import classIconRogue from "../../assets/icons/class-icon-rogue.webp";
import rogueMarksmanIcon from "../../assets/icons/rogue-marksman-icon.webp";
import rogueImbuementsIcon from "../../assets/icons/rogue-imbuements-icon.webp";
import rogueTrapsIcon from "../../assets/icons/rogue-traps-icon.webp";
// Druid
import classIconDruid from "../../assets/icons/class-icon-druid.webp";
import druidWerewolfIcon from "../../assets/icons/druid-werewolf-icon.webp";
import druidWerebearIcon from "../../assets/icons/druid-werebear-icon.webp";
import druidStormIcon from "../../assets/icons/druid-storm-icon.webp";
import druidEarthIcon from "../../assets/icons/druid-earth-icon.webp";

import "./class-info.styles.scss";

const iconMap = {
  // Barbarian
  berserking: barbarianBerserkingIcon,
  bleed: barbarianBleedIcon,
  walkingarsenal: barbarianWalkingArsenalIcon,
  unbridledrage: barbarianUnbridledRageIcon,
  // Necromancer
  undeadarmy: necromancerUndeadArmyIcon,
  bone: necromancerBoneIcon,
  darkness: necromancerDarknessIcon,
  blood: necromancerBloodIcon,
  // Sorcerer
  frost: sorcererFrostIcon,
  fire: sorcererFireIcon,
  shock: sorcererShockIcon,
  // Rogue
  marksman: rogueMarksmanIcon,
  imbuements: rogueImbuementsIcon,
  traps: rogueTrapsIcon,
  // Druid
  werewolf: druidWerewolfIcon,
  werebear: druidWerebearIcon,
  storm: druidStormIcon,
  earth: druidEarthIcon,
};

const GetClassIcon = (selectedClass) => {
  switch (selectedClass) {
    case "Barbarian":
      return classIconBarbarian;
    case "Necromancer":
      return classIconNecromancer;
    case "Sorcerer":
      return classIconSorcerer;
    case "Rogue":
      return classIconRogue;
    case "Druid":
      return classIconDruid;
    default:
      break;
  }
};

const getIconSrc = (iconName) => {
  return iconMap[iconName];
};

const ClassInfo = ({ selectedClass }) => {
  const [isOpen, setIsOpen] = useState(false);

  // CSSTransition "findDOMNode is deprecated in StrictMode" exception fix/workaround
  const nodeRef = React.useRef(null);

  const toggleInfo = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="class-info">
      <button className="d4-button class-info-button" onClick={toggleInfo}>
        Class Details
      </button>
      <CSSTransition
        in={isOpen}
        timeout={350}
        classNames="class-info-content-animation"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className="class-info-content">
          <div className="class-info-panel-emblem-container">
            <img src={GetClassIcon(selectedClass)} alt="class emblem" />
          </div>
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

          <div className="class-info-list-container">
            <ul>
              {selectedClass &&
                classDescriptions[selectedClass].details.map(
                  (detail, index) => (
                    <li key={index}>
                      <div className="class-info-detail-icon-container">
                        <img
                          src={getIconSrc(detail.icon)}
                          alt={`${detail.title} icon`}
                        />
                      </div>
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
