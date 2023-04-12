import React from "react";

import { getNodeAttributes } from "../../helpers/skill-tree/getNodeAttributes";
import "./skill-tooltip.styles.scss";

import dividerFrame from "../../assets/separator-frame-2.webp";

const SkillTooltipComponent = ({ nodeData, position, spellImage }) => {
  if (!nodeData || !position) {
    return null;
  }

  if (nodeData.nodeType === "nodeHub") {
    return null;
  }

  const nodeAttributes = getNodeAttributes(nodeData.nodeType); // Get the attributes based on nodeType
  const allocatedPoints = nodeData.allocatedPoints;

  const getDescriptionParts = () => {
    const hasPerSecond =
      nodeData.description.description.match(/( per second)/);

    const manaCostString = `
    <div class="description-mana-cost">
      Mana Cost: 
      ${nodeData.manaCostValues[0]}${
      hasPerSecond && hasPerSecond[1] ? `<span>${hasPerSecond[1]}</span>` : ""
    }
    </div>`;

    const cooldownString = `
    <div class="description-cooldown">
      Cooldown: 
      ${nodeData.manaCostValues[0]} seconds
    </div>`;

    const luckyHitString = `
    <div class="description-luck-hit-chance">
      Lucky Hit Chance:  
      ${nodeData.luckyHitValues[0]}%
    </div>`;

    let description = nodeData.description.description;

    if (description.includes("Mana Cost: {#}")) {
      description = description.replace("Mana Cost: {#}", manaCostString);
    }
    if (description.includes("Cooldown: {#} seconds")) {
      description = description.replace(
        "Cooldown: {#} seconds",
        cooldownString
      );
    }
    if (description.includes("Lucky Hit Chance: {#}%")) {
      description = description.replace(
        "Lucky Hit Chance: {#}%",
        luckyHitString
      );
    }

    const enchantmentIndex = description.indexOf("— Enchantment Effect —");

    if (enchantmentIndex === -1) {
      return [description, "", ""];
    } else {
      const preEnchantment = description.substring(0, enchantmentIndex);
      const enchantmentTitle = "— Enchantment Effect —";
      const enchantmentEffect = description.substring(
        enchantmentIndex + enchantmentTitle.length
      );

      return [preEnchantment, enchantmentTitle, enchantmentEffect];
    }
  };

  const replaceDescriptionValues = (text) => {
    return text.replace(
      /(\{#\w+\})|(\d+(\.\d+)?(%?))/g,
      (match, token, number) => {
        if (token) {
          const key = token.substring(2, token.length - 1);
          if (nodeData[key]) {
            const value =
              nodeData[key][allocatedPoints > 0 ? allocatedPoints - 1 : 0];
            return `<mark class="description-value dmg-value">${value}%</mark>`;
          }
        } else if (number) {
          return `<span class="description-value">${number}</span>`;
        }
        return match;
      }
    );
  };

  const [preEnchantment, enchantmentTitle, enchantmentEffect] =
    getDescriptionParts();
  const preEnchantmentHtml = replaceDescriptionValues(preEnchantment);
  const enchantmentTitleHtml = replaceDescriptionValues(enchantmentTitle);
  const enchantmentEffectHtml = replaceDescriptionValues(enchantmentEffect);

  return (
    <div
      className="skill-tooltip"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="tooltip-container">
        <div className="inner-frame-container"></div>
        <div className="image-container">
          {/* Add the frame and spell images */}
          <img
            className="tooltip-spell-image"
            src={spellImage}
            alt=""
            style={{
              width: nodeAttributes.spellTooltipWidth,
              height: nodeAttributes.spellTooltipHeight,
              transform: `translate(${
                nodeAttributes.spellTooltipTranslateX
              }px, ${nodeAttributes.spellTooltipTranslateY}px)${
                nodeAttributes.rotation
                  ? ` rotate(${nodeAttributes.rotation}deg)`
                  : ""
              }`,
            }}
          />
          <img
            className="tooltip-frame-image"
            src={nodeAttributes.image}
            alt=""
            style={{
              width: nodeAttributes.frameTooltipWidth,
              height: nodeAttributes.frameTooltipHeight,
              transform: `translate(${nodeAttributes.frameTooltipTranslateX}px, ${nodeAttributes.frameTooltipTranslateY}px)`,
            }}
          />
        </div>
        <div className="title-container">
          <h1>{nodeData.name}</h1>
        </div>
        <div className="separator">
          <img src={dividerFrame} alt="" />
        </div>
        {nodeData.allocatedPoints > 0 && (
          <div className="spell-rank-container">
            RANK {allocatedPoints}/{nodeData.maxPoints}
          </div>
        )}

        {nodeData.description && (
          <div className="description">
            <div
              className="main-description-container"
              dangerouslySetInnerHTML={{ __html: preEnchantmentHtml }}
            />
            {enchantmentTitleHtml && (
              <div
                className="enchantment-title"
                dangerouslySetInnerHTML={{ __html: enchantmentTitleHtml }}
              />
            )}
            {enchantmentEffectHtml && (
              <div
                className="enchantment-effect"
                dangerouslySetInnerHTML={{ __html: enchantmentEffectHtml }}
              />
            )}
          </div>
        )}
        <div className="tags">
          <ul>
            {nodeData.description.tags.map((tag, index) => (
              <li key={index} className="tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        {nodeData.allocatedPoints === 0 && (
          <div className="points-not-allocated">Not Yet Learned</div>
        )}
      </div>
    </div>
  );
};

export default SkillTooltipComponent;
