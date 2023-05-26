import React, { useRef, useEffect, useState } from "react";

import { getNodeAttributes } from "../../helpers/skill-tree/get-node-attributes";
import { getTagClass } from "../../data/tags/tag-style-helper";
import { getDamageTypeInfoAndIcon } from "../../helpers/skill-data/skill-data-helpers";

import "./skill-tooltip.styles.scss";
import separatorFrame from "../../assets/frames/separator-frame-2.webp";
import separatorFrameRight from "../../assets/frames/separator-right-side.webp";

import mouseAddIcon from "../../assets/icons/mouse-icon-allocate.webp";
import mouseRemoveIcon from "../../assets/icons/mouse-icon-deallocate.webp";

const SkillTooltipComponent = ({
  nodeData,
  position,
  spellImage,
  visible,
  toggleVisibility,
}) => {
  const tooltipRef = useRef();
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  const calculateTooltipPosition = () => {
    const { innerWidth, innerHeight } = window;

    if (innerWidth <= 765) {
      return {
        x: 0,
        y: innerHeight - tooltipSize.height - 10,
      };
    }

    const left = position.x + 20;
    const top = position.y + 20;

    const adjustedLeft =
      left + tooltipSize.width > innerWidth
        ? Math.max(0, left - tooltipSize.width - 30)
        : left;
    const adjustedTop =
      top + tooltipSize.height > innerHeight
        ? Math.max(0, top - tooltipSize.height - 25)
        : top;

    return { x: adjustedLeft, y: adjustedTop };
  };

  useEffect(() => {
    if (tooltipRef.current && visible) {
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      setTooltipSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [visible]);

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

  const renderDamageTypeInfo = (nodeData) => {
    if (nodeData.nodeType !== "activeSkill") return null;

    const { damageType, tooltipIcon } = getDamageTypeInfoAndIcon(
      nodeData.description.tags
    );

    if (!damageType) return null;

    return (
      <div className="damage-type-info">
        <img className="separator-right" src={separatorFrameRight} alt="" />
        <div className="icon-and-info">
          <img src={tooltipIcon} alt={damageType} />
          <span>{damageType}</span>
        </div>
      </div>
    );
  };

  const [preEnchantment, enchantmentTitle, enchantmentEffect] =
    getDescriptionParts();
  const preEnchantmentHtml = replaceDescriptionValues(preEnchantment);
  const enchantmentTitleHtml = replaceDescriptionValues(enchantmentTitle);
  const enchantmentEffectHtml = replaceDescriptionValues(enchantmentEffect);
  const damageTypeInformation = renderDamageTypeInfo(nodeData);

  return (
    <div
      ref={tooltipRef}
      className={`skill-tooltip${visible ? " visible" : ""}`}
      style={{
        left: calculateTooltipPosition().x,
        top: calculateTooltipPosition().y,
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
        {/* {nodeData.nodeType === "activeSkillUpgrade" && (
          <div className="ultimate-description">
            You may only select one Upgrade
          </div>
        )} */}
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
          <img
            className="mouse-icon-add"
            src={mouseAddIcon}
            alt="mouse-left-click-icon"
          />
          <span>Add point</span>
        </div>
      )}
      {nodeData.allocatedPoints > 0 && (
        <div className="point-allocating-help">
          <img
            className="mouse-icon-remove"
            src={mouseRemoveIcon}
            alt="mouse-right-click-icon"
          />
          <span>Remove point</span>
        </div>
      )}
    </div>
  );
};

export default SkillTooltipComponent;
