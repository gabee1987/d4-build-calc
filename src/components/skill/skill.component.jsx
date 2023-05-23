import React from "react";

import {
  normalizeSpellName,
  createSpellImagesMap,
} from "../../helpers/spell-images-loader/spell-images-map";
import "./skill.styles.scss";

const Skill = ({ data }) => {
  console.log("data -> ", data);
  const className = data.class.toLowerCase(); // get class name from skill data
  const spellImagesMap = createSpellImagesMap(className); // create images map for this class
  const skillNameNormalized = normalizeSpellName(data.name); // Normalize the spell name
  const skillImage = spellImagesMap[skillNameNormalized]; // get image path from the map
  console.log("data.description -> ", data.description);

  const luckyHitValues = data.luckyHitValues || []; // provide a default value of empty array if luckyHitValues is undefined
  const values1 = data.values1 || [];
  const values2 = data.values2 || [];
  const values3 = data.values2 || [];
  let description = data.description
    .replace("{#}", luckyHitValues.length > 0 ? luckyHitValues[0] : "N/A") // Use "N/A" if there are no luckyHitValues
    .replace("{#values1}", values1.length > 0 ? `${values1[4]}%` : "N/A")
    .replace("{#values2}", values2.length > 0 ? `${values2[4]}%` : "N/A")
    .replace("{#values3}", values2.length > 0 ? `${values2[4]}%` : "N/A");

  // Remove lucky hit chance from description
  const luckyHitRegex = new RegExp(
    `Lucky Hit Chance: ${
      luckyHitValues.length > 0 ? luckyHitValues[0] : "N/A"
    }%`,
    "g"
  );
  description = description.replace(luckyHitRegex, "");

  // Extract resource generation and cost indicator
  const resourceRegex = /Generate (.*): (\d+)/g;
  const resourceMatch = resourceRegex.exec(description);
  let resourceName = null;
  let resourceValues = null;
  if (resourceMatch) {
    resourceName = resourceMatch[1];
    resourceValues = [resourceMatch[2]];
    description = description.replace(resourceRegex, "");
  }

  const renderSkillIcon = () => (
    <div className="skill-icon-container">
      <img src={skillImage} className="skill-icon" alt={data.name} />
    </div>
  );

  const renderSkillHeader = () => (
    <div className="skill-header">
      <h2>{data.name}</h2>
      <div className="skill-class">
        <b>{data.type}</b> • {data.class}
      </div>
    </div>
  );

  const renderSkillTags = () => (
    <div className="skill-tags">
      {data.tags.map((tag, index) => (
        <div key={index} className="skill-tag">
          {tag}
        </div>
      ))}
    </div>
  );

  const renderSkillResource = (resourceName, resourceValues) => {
    if (resourceValues && resourceValues.length > 0) {
      return (
        <div className="skill-resource">
          <b>{resourceName}:</b> {resourceValues[0]}%
        </div>
      );
    }
    return null;
  };

  const renderSkillResources = () => (
    <div className="skill-resources">
      {renderSkillResource("Fury Generate", data.manaCostValues)}
      {renderSkillResource("Lucky Hit", data.luckyHitValues)}
      {renderSkillResource(resourceName, resourceValues)}
    </div>
  );

  const renderSkillDescription = () => (
    <div className="skill-description">
      <div className="skill-description-item">{description}</div>
    </div>
  );

  const renderSkillExtra = () => (
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
  );

  const renderSkillRune = (child, index) => (
    <div key={index} className="skill-rune">
      <div className="skill-rune-type">{child.name}</div>
      <div className="skill-description">
        <div className="skill-description-item">{child.description}</div>
      </div>
    </div>
  );

  const renderSkillRunes = () => (
    <div className="skill-runes">{data.children.map(renderSkillRune)}</div>
  );

  return (
    <li className="skill">
      {renderSkillIcon()}
      <div className="skill-details">
        {renderSkillHeader()}
        {renderSkillTags()}
        {renderSkillResources()}
        {renderSkillDescription()}
        {renderSkillExtra()}
        {renderSkillRunes()}
      </div>
    </li>
  );
};

export default Skill;
