import React from "react";

import { getNodeAttributes } from "../../helpers/skill-tree/getNodeAttributes";
import "./skill-tooltip.styles.scss";

import dividerFrame from "../../assets/separator-frame-2.webp";

const SkillTooltipComponent = ({
  nodeData,
  position,
  descriptionValues,
  descriptionExtraValues,
  spellImage,
}) => {
  if (!nodeData || !position) {
    return null;
  }

  const nodeAttributes = getNodeAttributes(nodeData.nodeType); // Get the attributes based on nodeType

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
          {/* <div
            className="tooltip-images"
            data-spell-image={spellImage}
            style={{
              background: `
                url(${nodeAttributes.image}) center center / ${nodeAttributes.frameTooltipWidth}px ${nodeAttributes.frameTooltipHeight}px no-repeat`,
              width: nodeAttributes.frameTooltipWidth,
              height: nodeAttributes.frameTooltipHeight,
              // transform: `translate(${nodeAttributes.spellTooltipTranslateX}px, ${nodeAttributes.spellTooltipTranslateY}px)`,
            }}
          /> */}
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
          <img className="tooltip-divider" src={dividerFrame} alt="" />
        </div>
        {/* <p>Type: {nodeData.nodeType}</p> */}
        <div className="allocated-max-points">
          {nodeData.allocatedPoints === 0 ? (
            <span className="points-not-allocated">Not Yet Learned</span>
          ) : (
            <div className="points-allocated">
              <span>{nodeData.allocatedPoints}</span> <span>/</span>{" "}
              <span>{nodeData.maxPoints}</span>
            </div>
          )}
        </div>
        {nodeData.description && (
          <div className="description">
            {nodeData.description &&
              populateDescriptionNumbers(
                nodeData.description,
                descriptionValues,
                descriptionExtraValues
              )
                .split("\n")
                .map((line, index) => {
                  if (line.startsWith("Lucky Hit Chance")) {
                    return (
                      <p
                        key={index}
                        className="lucky-hit-chance"
                        dangerouslySetInnerHTML={{ __html: line }}
                      />
                    );
                  } else if (line.includes("— Enchantment Effect —")) {
                    return (
                      <p
                        key={index}
                        className="enchantment-effect"
                        dangerouslySetInnerHTML={{ __html: line }}
                      />
                    );
                  } else {
                    return (
                      <p
                        key={index}
                        dangerouslySetInnerHTML={{ __html: line }}
                      />
                    );
                  }
                })}
          </div>
        )}
      </div>
    </div>
  );
};

function populateDescriptionNumbers(
  description,
  descriptionValues,
  descriptionExtraValues
) {
  if (!description || !descriptionValues) return description;

  // Replacing the basic values (Spell dmg and Spell effects)
  let result = description;
  descriptionValues.forEach((value, index) => {
    const valueSpan =
      result.includes("Mana Cost") && index === 0
        ? `<span class="description-value mana-cost-value">${value}</span>`
        : `<span class="description-value">${value}</span>`;
    result = result.replace("{#}", valueSpan);
  });

  // Replacing the extra values (Enchantment Effect) if there are extra values
  if (descriptionExtraValues && result) {
    descriptionExtraValues.forEach((extraValue) => {
      result = result.replace(
        "{#}",
        `<span class="description-extra-value">${extraValue}</span>`
      );
    });
  }

  return result;
}

export default SkillTooltipComponent;
