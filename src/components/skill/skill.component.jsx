import React from "react";

import {
  normalizeSpellName,
  createSpellImagesMap,
} from "../../helpers/spell-images-loader/spell-images-map";
import {
  extractResourceGeneration,
  extractResourceCost,
  extractCooldown,
  extractCharges,
  extractLuckyHit,
  removeExtractedLines,
  replaceLuckyHit,
  replaceValues,
  replaceResourceCost,
  replaceCooldownValue,
  getDamageTypeInfoAndIcon,
  cleanSkillRuneName,
} from "../../helpers/skill-data/skill-data-helpers";

import "./skill.styles.scss";

const Skill = ({ data }) => {
  // console.log("data -> ", data);
  const className = data.class.toLowerCase(); // get class name from skill data
  const spellImagesMap = createSpellImagesMap(className); // create images map for this class
  const skillNameNormalized = normalizeSpellName(data.name); // Normalize the spell name
  const skillImage = spellImagesMap[skillNameNormalized]; // get image path from the map
  // console.log("data.description -> ", data.description);

  // Extract resource generation
  const resourceGenerationLine = extractResourceGeneration(data.description);

  // Extract resource cost
  const resourceCostLine = extractResourceCost(data.description);

  // Extract cooldown
  const cooldownLine = extractCooldown(data.description);

  // Extract charges
  const chargesLine = extractCharges(data.description);

  // Extract lucky hit chance
  const luckyHitLine = extractLuckyHit(data.description);

  // Remove the extracted lines
  const cleanedDescription = removeExtractedLines(data.description);

  // Replace placeholders in description
  const { values1, values2, values3 } = data; // Destructure all possible values from the data
  const values = { values1, values2, values3 }; // Gather them into one object
  // Filter out undefined values
  const filteredValues = Object.fromEntries(
    Object.entries(values).filter(([_, v]) => v !== undefined)
  );
  const replacedDescription = replaceValues(
    cleanedDescription,
    filteredValues,
    data.maxPoints
  );

  const replacedLuckyHitLine = replaceLuckyHit(
    luckyHitLine,
    data.luckyHitValues
  );

  const replacedCostResourceLine = replaceResourceCost(
    resourceCostLine,
    data.manaCostValues
  );

  const replacedCooldownLine = replaceCooldownValue(
    cooldownLine,
    data.manaCostValues
  );

  const renderSkillIcon = () => (
    <div className="skill-icon-container">
      <img src={skillImage} className="skill-icon" alt={data.name} />
    </div>
  );

  const renderSkillHeader = () => (
    <div className="skill-header">
      <h2>{data.name}</h2>
      <div className="skill-class">
        <span>{data.category}</span> • {data.class}
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

  const renderSkillResources = () => (
    <div className="skill-resources">
      <div
        className="skill-resource"
        dangerouslySetInnerHTML={{ __html: resourceGenerationLine }}
      ></div>
      <div
        className="skill-resource"
        dangerouslySetInnerHTML={{ __html: replacedCostResourceLine }}
      ></div>
      <div
        className="skill-resource"
        dangerouslySetInnerHTML={{ __html: chargesLine }}
      ></div>
      <div
        className="skill-resource"
        dangerouslySetInnerHTML={{ __html: replacedCooldownLine }}
      ></div>
      <div
        className="skill-resource"
        dangerouslySetInnerHTML={{ __html: replacedLuckyHitLine }}
      ></div>
    </div>
  );

  const renderSkillDescription = () => (
    <div
      className="skill-description"
      dangerouslySetInnerHTML={{ __html: replacedDescription }}
    ></div>
  );

  const renderSkillExtra = () => {
    const { damageType, tooltipIcon } = getDamageTypeInfoAndIcon(data.tags);

    if (!damageType) return null;

    return (
      <div className="skill-extra">
        <div className="skill-extra-item">
          <img
            src={tooltipIcon}
            className="skill-extra-item-icon"
            alt={damageType}
          />
          {damageType}
        </div>
      </div>
    );
  };

  const renderSkillRune = (child, index) => {
    let runeType = cleanSkillRuneName(child.name, data.name); // replace 'Bash' with the actual base skill name

    return (
      <div key={index} className="skill-rune">
        <div className="skill-rune-type">{runeType}</div>
        <div className="skill-description">
          <div className="skill-description-item">{child.description}</div>
        </div>
      </div>
    );
  };

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
