import React, { useState, useEffect, lazy, Suspense } from "react";

import LoadingSpinner from "../shared/loading-spinner/loading-spinner.component";

import "./aspect.styles.scss";

const Aspect = ({ data }) => {
  const { name, class: aspectClass, slots, description, category } = data;
  // const [aspectIcon, setAspectIcon] = useState(null);

  const LazyAspectIcon = lazy(() => import("./lazy-aspect-icon.component.jsx"));

  const renderSkillIcon = () => (
    <div className="aspect-icon-container">
      <Suspense fallback={<LoadingSpinner />}>
        <LazyAspectIcon category={category} />
      </Suspense>
    </div>
  );

  return (
    <li className="aspect">
      <div className="aspect-bg-container"></div>
      <div className="aspect-horizontal-center"></div>
      <div className="aspect-vertical-center"></div>
      {renderSkillIcon()}
      <div className="aspect-details">
        <div className="aspect-header">
          <div className="aspect-name">
            <h2>{name}</h2>
            <div className="aspect-class">
              <span>{category}</span> • {aspectClass}
            </div>
          </div>
        </div>
        <div className="aspect-resources">
          <div className="aspect-resource">
            <span className="aspect-resource-label">
              <b>Slots:</b>
            </span>{" "}
            {slots.join(", ")}
          </div>
        </div>
        <div className="aspect-description">{description}</div>
      </div>
    </li>
  );
};

export default Aspect;
