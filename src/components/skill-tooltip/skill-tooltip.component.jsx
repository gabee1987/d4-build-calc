import React from "react";
import "./skill-tooltip.styles.scss";

const SkillTooltipComponent = ({
  nodeData,
  position,
  descriptionValues,
  descriptionExtraValues,
}) => {
  if (!nodeData || !position) {
    return null;
  }

  return (
    <div
      className="skill-tooltip"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="title-container">
        <h1>{nodeData.name}</h1>
      </div>
      <div className="separator"></div>
      <p>Type: {nodeData.nodeType}</p>
      <div className="allocated-max-points">
        <span>{nodeData.allocatedPoints}</span> <span>/</span>{" "}
        <span>{nodeData.maxPoints}</span>
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
                    <p key={index} className="lucky-hit-chance">
                      {line}
                    </p>
                  );
                } else if (line.includes("— Enchantment Effect —")) {
                  return (
                    <p key={index} className="enchantment-effect">
                      {line}
                    </p>
                  );
                } else {
                  return <p key={index}>{line}</p>;
                }
              })}
        </div>
      )}
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
  descriptionValues.forEach((value) => {
    result = result.replace("{#}", value);
  });

  console.log(result);
  console.log(descriptionExtraValues);
  // Replacing the extra values (Enchantment Effect) if there are extra values
  if (descriptionExtraValues && result) {
    descriptionExtraValues.forEach((extraValue) => {
      result = result.replace("{#}", extraValue);
    });
  }

  return result;
}

export default SkillTooltipComponent;
