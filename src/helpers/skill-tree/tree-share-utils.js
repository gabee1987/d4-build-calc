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
