const fs = require("fs");

const inputData = require("./input.js"); // Replace "./data" with the path to your JS data file
const outputFilePath = "output.json";

const centerX = 0;
const centerY = 0;

function processNode(node, parent, data, processedNodes) {
  if (processedNodes.includes(node.name)) {
    return;
  }
  processedNodes.push(node.name);

  const updatedNode = {
    name: node.name,
	baseSkill: node.baseSkill,
    connections: node.connections,
    description: node.description,
    id: node.id,
    maxPoints: node.maxPoints,
    allocatedPoints: 0,
    nodeType: "nodeType_ToReplace",
    values: node.values,
    extraValues: node.extraValues,
    x: node.x + centerX,
    y: node.y + centerY,
  };

  if (parent) {
    updatedNode.connections = updatedNode.connections.filter(
      (connection) => connection !== parent.name
    );
  }

  const children = [];
  for (const connection of updatedNode.connections) {
    const child = data.find((child) => child.name === connection);
    if (child) {
      const processedChild = processNode(child, updatedNode, data, processedNodes);
      if (processedChild) {
        children.push(processedChild);
      }
    }
  }

  if (children.length > 0) {
    updatedNode.children = children;
  } else {
    delete updatedNode.children;
  }

  return updatedNode;
}

function processData(data) {
  const processedNodes = [];
  if (Array.isArray(data)) {
    return data
      .map((item) => processNode(item, null, data, processedNodes))
      .filter((item) => item);
  } else {
    const dataArray = Object.keys(data).map((key) => ({ ...data[key], name: key }));
    return dataArray
      .map((item) => processNode(item, null, dataArray, processedNodes))
      .filter((item) => item);
  }
}

const outputData = processData(inputData);

fs.writeFile(outputFilePath, JSON.stringify(outputData, null, 2), (err) => {
  if (err) {
    console.log("Error writing file:", err);
  } else {
    console.log("Output saved to", outputFilePath);
  }
});