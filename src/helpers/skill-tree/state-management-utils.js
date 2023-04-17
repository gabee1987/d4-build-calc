export const generatePointsParam = (nodes) => {
  const allocatedNodes = nodes.filter((node) => node.allocatedPoints > 0);
  return allocatedNodes
    .map((node) => `${node.id}:${node.allocatedPoints}`)
    .join(";");
};

export const parsePointsParam = (pointsParam, nodes) => {
  const updatedNodes = JSON.parse(JSON.stringify(nodes)); // Create a deep copy to avoid modifying the original data
  const points = pointsParam.split(";");

  points.forEach((point) => {
    const [nodeId, allocatedPoints] = point.split(":");
    const node = updatedNodes.find((n) => n.id === nodeId);

    if (node) {
      node.allocatedPoints = parseInt(allocatedPoints, 10);
    }
  });

  return updatedNodes;
};

export const updateSkillTree = (initialSkillTreeData, pointsParam) => {
  console.log(initialSkillTreeData);
  const updatedSkillTreeData = JSON.parse(
    JSON.stringify(initialSkillTreeData, createCircularReplacer())
  ); // Create a deep copy with circular reference handling
  const points = pointsParam.split(";");

  points.forEach((point) => {
    const [nodeId, allocatedPoints] = point.split(":");
    const node = findNodeById(updatedSkillTreeData, nodeId);

    if (node) {
      node.allocatedPoints = parseInt(allocatedPoints, 10);
    }
  });

  return updatedSkillTreeData;
};

function createCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return; // or return a default value or throw an error, based on your needs
      }
      seen.add(value);
    }
    return value;
  };
}

function findNodeById(node, nodeId) {
  if (node.id === nodeId) {
    return node;
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const foundNode = findNodeById(child, nodeId);
      if (foundNode) {
        return foundNode;
      }
    }
  }

  return null;
}
