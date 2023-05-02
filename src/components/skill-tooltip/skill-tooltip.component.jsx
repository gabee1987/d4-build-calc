import React, { useState } from "react";

import { getNodeAttributes } from "../../helpers/skill-tree/get-node-attributes";
import { getTagClass } from "../../data/tags/tag-style-helper";

import "./skill-tooltip.styles.scss";
import separatorFrame from "../../assets/frames/separator-frame-2.webp";
import separatorFrameRight from "../../assets/frames/separator-right-side.webp";
import fireDmgIcon from "../../assets/dmg-icons/fire-damage-icon-diablo-4.webp";
import coldDmgIcon from "../../assets/dmg-icons/cold-damage-icon-diablo-4.webp";
import lightningDmgIcon from "../../assets/dmg-icons/lightning-damage-icon-diablo-4.webp";
import poisonDmgIcon from "../../assets/dmg-icons/poison-damage-icon-diablo-4.webp";
import shadowDmgIcon from "../../assets/dmg-icons/shadow-damage-icon-diablo-4.webp";
import physicalDmgIcon from "../../assets/dmg-icons/physical-damage-icon-diablo-4.webp";
import mouseAddIcon from "../../assets/icons/mouse-icon-allocate.webp";
import mouseRemoveIcon from "../../assets/icons/mouse-icon-deallocate.webp";

const SkillTooltipComponent = ({
  nodeData,
  position,
  spellImage,
  visible,
  toggleVisibility,
}) => {
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

    const resourceType =
      nodeData.description.description.match(
        /(Fury|Essence|Spirit) Cost:/
      )?.[0] || "Mana Cost:";
    const resourceValue = nodeData.manaCostValues[0];

    const resourceCostString = `
      <div class="description-resource-cost">
      ${resourceType} 
      ${resourceValue}${
      hasPerSecond && hasPerSecond[1] ? `<span>${hasPerSecond[1]}</span>` : ""
    }
      </div>`;

    const cooldownString = `
      <div class="description-cooldown">
      Cooldown: 
      ${
        nodeData.manaCostValues.length === 0
          ? nodeData.luckyHitValues[0]
          : nodeData.manaCostValues[0]
      } seconds
      </div>`;

    const luckyHitString = `
      <div class="description-luck-hit-chance">
      Lucky Hit Chance:  
      ${nodeData.luckyHitValues[0]}%
      </div>`;

    let description = nodeData.description.description;
    description = description.split("•").join("<br>•");

    if (
      description.includes("Mana Cost: {#}") ||
      description.includes(resourceType)
    ) {
      description = description.replace("Mana Cost: {#}", resourceCostString);
      description = description.replace(
        `${resourceType} {#}`,
        resourceCostString
      );
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

  const cleanString = (str) => {
    return str.replace(/[^a-zA-Z]+/g, "").toLowerCase();
  };

  const getDamageTypeInfo = (nodeData) => {
    const hasFire = nodeData.description.tags.some(
      (tag) =>
        cleanString(tag) === cleanString("Fire") ||
        cleanString(tag) === cleanString("Burn")
    );
    const hasFrost = nodeData.description.tags.some(
      (tag) =>
        cleanString(tag) === cleanString("Frost") ||
        cleanString(tag) === cleanString("Cold")
    );
    const hasLightning = nodeData.description.tags.some(
      (tag) =>
        cleanString(tag) === cleanString("Lightning") ||
        cleanString(tag) === cleanString("Shock")
    );
    const hasPoison = nodeData.description.tags.some(
      (tag) => cleanString(tag) === cleanString("Poison")
    );
    const hasShadow = nodeData.description.tags.some(
      (tag) => cleanString(tag) === cleanString("Shadow")
    );
    const hasPhysical = nodeData.description.tags.some(
      (tag) => cleanString(tag) === cleanString("Physical")
    );

    let damageTypeInfo;

    if (
      nodeData.nodeType === "activeSkill" &&
      (hasFire ||
        hasFrost ||
        hasLightning ||
        hasPoison ||
        hasShadow ||
        hasPhysical)
    ) {
      let tooltipText = "";
      let tooltipIcon = null;

      if (hasFire) {
        tooltipText = "Fire damage";
        tooltipIcon = fireDmgIcon;
      } else if (hasFrost) {
        tooltipText = "Frost damage";
        tooltipIcon = coldDmgIcon;
      } else if (hasLightning) {
        tooltipText = "Lightning damage";
        tooltipIcon = lightningDmgIcon;
      } else if (hasPoison) {
        tooltipText = "Poison damage";
        tooltipIcon = poisonDmgIcon;
      } else if (hasShadow) {
        tooltipText = "Shadow damage";
        tooltipIcon = shadowDmgIcon;
      } else if (hasPhysical) {
        tooltipText = "Physical damage";
        tooltipIcon = physicalDmgIcon;
      }

      damageTypeInfo = (
        <div className="damage-type-info">
          <img className="separator-right" src={separatorFrameRight} alt="" />
          <div className="icon-and-info">
            <img src={tooltipIcon} alt={tooltipText} />
            <span>{tooltipText}</span>
          </div>
        </div>
      );
    }

    return damageTypeInfo;
  };

  const [preEnchantment, enchantmentTitle, enchantmentEffect] =
    getDescriptionParts();
  const preEnchantmentHtml = replaceDescriptionValues(preEnchantment);
  const enchantmentTitleHtml = replaceDescriptionValues(enchantmentTitle);
  const enchantmentEffectHtml = replaceDescriptionValues(enchantmentEffect);
  const damageTypeInformation = getDamageTypeInfo(nodeData);

  return (
    <div
      className={`skill-tooltip${visible ? " visible" : ""}`}
      style={{
        left: position.x + 60,
        top: position.y + 50,
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

        {/* TITLE */}
        <div className="title-container">
          <h1>{nodeData.name}</h1>
        </div>
        {nodeData.allocatedPoints > 0 && (
          <div className="spell-rank-container">
            RANK {allocatedPoints}/{nodeData.maxPoints}
          </div>
        )}

        {/* TAGS */}
        <div className="tags-container">
          <ul>
            {nodeData.description.tags.map((tag, index) => (
              <li key={index} className={`tag ${getTagClass(tag)}`}>
                {tag.replace(/[^\w\s]+/g, "")}
              </li>
            ))}
          </ul>
        </div>
        <div className="separator">
          <img src={separatorFrame} alt="" />
        </div>

        {/* DESCRIPTION */}
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
        {nodeData.isUltimate && (
          <div className="ultimate-description">
            You may only select one Ultimate Skill
          </div>
        )}
        {damageTypeInformation && (
          <div className="damagetype-info-container">
            {damageTypeInformation}
          </div>
        )}
        {nodeData.allocatedPoints === 0 && (
          <div className="points-not-allocated">Not Yet Learned</div>
        )}
      </div>
      {nodeData.allocatedPoints === 0 && (
        <div className="point-allocating-help">
          <img className="mouse-icon-add" src={mouseAddIcon} alt="" />
          <span>Add point</span>
        </div>
      )}
      {nodeData.allocatedPoints > 0 && (
        <div className="point-allocating-help">
          <img className="mouse-icon-remove" src={mouseRemoveIcon} alt="" />
          <span>Remove point</span>
        </div>
      )}
    </div>
  );
};

export default SkillTooltipComponent;
