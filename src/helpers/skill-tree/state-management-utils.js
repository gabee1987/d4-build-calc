export const generatePointsParam = (nodes) => {
  const allocatedNodes = nodes.filter((node) => node.allocatedPoints > 0);
  return allocatedNodes
    .map((node) => `${node.id}:${node.allocatedPoints}`)
    .join(";");
};

export const parsePointsParam = (pointsParam, nodes) => {
  const points = pointsParam.split(";");

  points.forEach((point) => {
    const [nodeId, allocatedPoints] = point.split(":");
    const node = nodes.find((n) => n.id === nodeId);

    if (node) {
      node.allocatedPoints = parseInt(allocatedPoints, 10);
    }
  });
};
