import * as d3 from "d3";

// POINT INDICATOR
export const updatePointIndicator = (
  nodeName,
  allocatedPoints,
  maxPoints,
  nodeType,
  treeContainerRef
) => {
  d3.select(treeContainerRef.current)
    .selectAll(".point-indicator")
    .filter((d) => d.name === nodeName)
    .text((d) =>
      nodeType !== "nodeHub" && maxPoints > 1 && d.allocatedPoints > 0
        ? `${allocatedPoints}/${maxPoints}`
        : ""
    );
};
