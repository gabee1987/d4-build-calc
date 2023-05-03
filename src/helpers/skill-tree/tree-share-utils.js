import {
  drawActiveLinkImage,
  drawStaticActiveNodeHubLinks,
} from "./skill-tree-utils";
import { updatePointIndicator } from "../../helpers/skill-tree/d3-tree-update.js";

export const generateURLWithAllocatedPoints = (nodes, selectedClass) => {
  const allocatedNodes = nodes
    .filter((node) => node.allocatedPoints > 0)
    .map((node) => `${node.id}:${node.allocatedPoints}`);

  const url = `${
    window.location.origin
  }/skill-tree/${selectedClass}/${allocatedNodes.join(";")}`;
  return url;
};

export const parseAllocatedPointsFromURL = (selectedClass) => {
  const allocatedPoints = window.location.pathname.split("/").pop();

  if (allocatedPoints && allocatedPoints.length > 0) {
    const points = allocatedPoints.split(";").map((point) => {
      const [id, value] = point.split(":");
      return { id, value: parseInt(value) };
    });

    return points;
  } else {
    return null;
  }
};

export const updateTreeAfterUrlLoad = (
  node,
  nodes,
  links,
  svg,
  containerGroup,
  nodeGroup,
  treeContainerRef,
  totalAllocatedPoints
) => {
  // Find the parentNode (nodeHub) of the allocated node
  const parentNode = nodes.find((n) => node.connections.includes(n.name));

  // Find the link between the parentNode and the allocated node
  const allocatedLink = links.find(
    (link) =>
      link.source.name === parentNode.name && link.target.name === node.name
  );

  drawActiveLinkImage(
    svg,
    containerGroup,
    allocatedLink,
    nodes.indexOf(node),
    node,
    parentNode,
    nodeGroup,
    true // Load from Url
  );

  //   drawStaticActiveNodeHubLinks(
  //     svg,
  //     containerGroup,
  //     nodes,
  //     totalAllocatedPoints
  //   );

  updatePointIndicator(
    node.name,
    node.allocatedPoints,
    node.maxPoints,
    node.nodeType,
    treeContainerRef
  );
};
