import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import ClassSelectionContext from "../../contexts/class-selection.context.jsx";

import "./class-overview.styles.scss";

const ClassOverviewComponent = () => {
  const { selectedClass } = useContext(ClassSelectionContext);
  const { className } = useParams();

  const classImage = require(`../../assets/classes/${className}-class-overview-bg.webp`);

  return (
    <div className="class-overview-container">
      <h1>{selectedClass}</h1>
      <img src={classImage} alt={selectedClass} />
      <p>Here you can add custom class text and more class details...</p>
    </div>
  );
};

export default ClassOverviewComponent;
