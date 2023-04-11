import React from "react";

import { getNodeAttributes } from "../../helpers/skill-tree/getNodeAttributes";
import "./skill-tooltip.styles.scss";

import dividerFrame from "../../assets/separator-frame-2.webp";

const SkillTooltipComponent = ({ nodeData, position, spellImage }) => {
  if (!nodeData || !position) {
    return null;
  }

  const nodeAttributes = getNodeAttributes(nodeData.nodeType); // Get the attributes based on nodeType

  const luckyHitValue = nodeData.luckyHitValues
    ? nodeData.luckyHitValues[0]
    : null;
  const manaCostValue = nodeData.manaCostValues
    ? nodeData.manaCostValues[0]
    : null;
  const allocatedPoints =
    nodeData.allocatedPoints > 0 ? nodeData.allocatedPoints - 1 : 0;

  const descriptionLines = nodeData.description
    ? nodeData.description.description.split("\n")
    : [];

  const updatedDescriptionLines = descriptionLines
    .filter((line) => typeof line === "string" && !line.startsWith("Tags:"))
    .map((line) => {
      if (luckyHitValue && line.includes("Lucky Hit Chance: {#}%")) {
        return line.replace("{#}", luckyHitValue);
      } else if (manaCostValue && line.includes("Mana Cost: {#}")) {
        return line.replace("{#}", manaCostValue);
      } else if (line.includes("{")) {
        return line.replace(/{([\d./]+)}/, (_, values) => {
          const valueArray = values.split("/");
          return valueArray[allocatedPoints];
        });
      } else {
        return line;
      }
    });

  const tags = descriptionLines
    .find((line) => line.startsWith("Tags:"))
    .replace("Tags:", "")
    .trim()
    .split(", ");

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
        {nodeData.description && (
          <div className="description">
            {updatedDescriptionLines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
        <div className="tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

function populateDescriptionNumbers(
  description,
  nodeData,
  descriptionValues,
  descriptionExtraValues,
  extraDescription
) {
  if (!description || !descriptionValues) return description;

  let result = description;
  const allocatedPoints =
    nodeData.allocatedPoints > 0 ? nodeData.allocatedPoints - 1 : 0;

  result = result.replace(/\{([\d./]+)\}%/, (_, values) => {
    const valueArray = values.split("/");
    return `<span class="damage-value">${valueArray[allocatedPoints]}%</span>`;
  });

  if (nodeData.manaCostValues) {
    result = result.replace(
      /\{#\}/,
      `<span class="mana-cost-value">${nodeData.manaCostValues[0]}</span>`
    );
  }

  if (nodeData.luckyHitValues) {
    result = result.replace(
      /\{#\}/,
      `<span class="lucky-hit-value">${nodeData.luckyHitValues[0]}</span>`
    );
  }

  ["values1", "values2", "values3"].forEach((valuesKey) => {
    if (nodeData.description[valuesKey]) {
      result = result.replace(
        /\{#\}/,
        `<span class="description-value">${nodeData.description[valuesKey][allocatedPoints]}</span>`
      );
    }
  });

  if (descriptionExtraValues && result) {
    descriptionExtraValues.forEach((extraValue) => {
      result = result.replace(
        /\{#\}/,
        `<span class="description-extra-value">${extraValue}</span>`
      );
    });
  }

  if (extraDescription) {
    const extraValue = descriptionExtraValues ? descriptionExtraValues[0] : "";
    const extraDesc = extraDescription.replace(
      "{#}",
      `<span class="description-extra-value">${extraValue}</span>`
    );
    result += `\n— Enchantment Effect —\n${extraDesc}`;
  }

  return result;
}

export default SkillTooltipComponent;
