import React from "react";

import createSpellImagesMap from "../../helpers/spell-images-loader/spell-images-map";
import "./skill.styles.scss";

const Skill = ({ data }) => {
  const className = data.class.toLowerCase(); // get class name from skill data
  const spellImagesMap = createSpellImagesMap(className); // create images map for this class
  const skillImage = spellImagesMap[data.name]; // get image path from the map

  const renderSkillResource = (resourceName, resourceValues) => {
    if (resourceValues && resourceValues.length > 0) {
      return (
        <div className="skill__resource">
          <b>{resourceName}:</b> {resourceValues[0]}%
        </div>
      );
    }
    return null;
  };

  const renderSkillRunes = (children) => {
    return children.map((child, index) => (
      <div key={index} className="skill-rune">
        <div className="skill-divider">{child.name}</div>
        <div className="skill-description">
          <div className="skill-description-item">{child.description}</div>
        </div>
      </div>
    ));
  };

  return (
    <li className="skill">
      <div className="skill-left">
        <img src={skillImage} className="skill-icon" alt={data.name} />
      </div>
      <div className="skill-middle">
        <div className="skill-header">
          <h2>{data.name}</h2>
          <div className="skill-class">
            <b>{data.type}</b> • {data.class}
          </div>
        </div>
        <div className="skill-tags">
          {data.tags.map((tag, index) => (
            <div key={index} className="skill-tag">
              {tag}
            </div>
          ))}
        </div>
        <div className="skill-resources">
          {renderSkillResource("Fury Generate", data.manaCostValues)}
          {renderSkillResource("Lucky Hit", data.luckyHitValues)}
        </div>
        <div className="skill-description">
          <div className="skill-description-item">{data.description}</div>
        </div>
        <div className="skill-extra">
          <div className="skill-extra-item">
            <img
              src="https://rerollcdn.com/DIABLO4/Elements/physical.png"
              className="skill-extra-item-icon"
              alt="Physical Damage"
            />
            Physical Damage
          </div>
        </div>
        <div className="skill-runes">{renderSkillRunes(data.children)}</div>
      </div>
    </li>
  );
};

export default Skill;
