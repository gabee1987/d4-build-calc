import React from "react";

import "./aspect.styles.scss";

const Aspect = ({ data }) => {
  const { name, class: aspectClass, slots, description, category } = data;
  //const skillNameNormalized = normalizeSpellName(data.name);
  //const aspectImage = aspectImagesMap[skillNameNormalized];

  const renderSkillIcon = () => (
    <div className="skill-icon-container">
      <img src={0} className="skill-icon" alt={data.name} />
    </div>
  );

  return (
    <li className="aspect">
      <div className="aspect-bg-container"></div>
      <div className="aspect-horizontal-center"></div>
      <div className="aspect-vertical-center"></div>
      <div className="aspect-details">
        <div className="aspect-header">
          <div className="aspect-name">
            <h2>{name}</h2>
            <div className="aspect-class">
              <span>{category}</span> • <b>{aspectClass}</b>
            </div>
          </div>
        </div>
        <div className="aspect-resources">
          <div className="aspect-resource">
            <span className="aspect-resource-label">Slots:</span>{" "}
            {slots.join(", ")}
          </div>
          <div className="aspect-resource">
            <img
              className="aspect-resource-icon"
              //   src={`https://rerollcdn.com/DIABLO4/Codex/1/${category}.png`}
              alt={name}
            />
          </div>
        </div>
        <div className="aspect-description">{description}</div>
      </div>
    </li>
  );
};

export default Aspect;
