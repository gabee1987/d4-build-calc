import React, { useContext } from "react";
import PointsContext from "../skill-tree/points.context";
import "./point-panel.styles.scss";

const PointIndicatorPanel = () => {
  const { allocatedPoints, remainingPoints } = useContext(PointsContext);

  return (
    <div className="point-panel">
      <div className="point-info points-spent">
        <span>{allocatedPoints}</span> <p>points spent</p>
      </div>
      <div className="point-info points-left">
        <h3>Available Points</h3>
        <h2 className="remaining-points">{remainingPoints}</h2>
      </div>
    </div>
  );
};

export default PointIndicatorPanel;
