const fs = require("fs");

const inputData = require("./input.js"); // Replace "./data" with the path to your JS data file
const outputFilePath = "output.json";

const centerX = 0;
const centerY = 0;

function getFirstLetters(str) {
  const words = str.split(" ");
  const firstLetters = words.map((word) => word.charAt(0));
  const result = firstLetters.join("");
  return result;
}

function extractTags(description, skillName) {
  const tagRegex = /Tags:(.*)/;

  const tagMatch = description.match(tagRegex);
  let tags = [];
  if (tagMatch) {
    tags = tagMatch[1]
      .trim()
      .split(",")
      .map((tag) => tag.trim());
    description = description.replace(tagMatch[0], "").trim();
  } else {
    console.warn(`No tags found for skill: ${skillName}`);
  }

  return {
    tags,
    updatedDescription: description,
  };
}

function extractDescriptionData(description, skillName) {
  const { tags, updatedDescription } = extractTags(description, skillName);

  return {
    description: updatedDescription,
    tags,
  };
}

function extractAndReplaceValues(description) {
  const valueSeriesRegex = /{((?:\d+(?:\.\d+)?\/)+\d+(?:\.\d+)?)}%/g;
  const extractedValues = [];
  let match;
  let replacedDescription = description;

  while ((match = valueSeriesRegex.exec(description)) !== null) {
    const series = match[1].split("/").map(Number);
    extractedValues.push(series);
    replacedDescription = replacedDescription.replace(
      match[0],
      `{#values${extractedValues.length}}`
    );
  }

  return {
    replacedDescription,
    extractedValues,
  };
}

function processNode(node, parent, data, processedNodes) {
  if (processedNodes.includes(node.name)) {
    return;
  }
  processedNodes.push(node.name);

  const { replacedDescription, extractedValues } = extractAndReplaceValues(
    node.description
  );
  const extractedData = extractDescriptionData(replacedDescription, node.name);

  const manaCostValues = [];
  const luckyHitValues = [];

  if (node.values) {
    if (node.values.length === 1) {
      luckyHitValues.push(node.values[0]);
    } else if (node.values.length === 2) {
      manaCostValues.push(node.values[0]);
      luckyHitValues.push(node.values[1]);
    }
  }

  let nodeType = "unknown";
  if (node.maxPoints === 1) {
    nodeType = "capstoneSkill";
  } else if (node.maxPoints === 3) {
    nodeType = "passiveSkill";
  } else if (node.maxPoints === 5) {
    nodeType = parent ? "activeSkillBuff" : "activeSkill";
  }

  const updatedNode = {
    name: node.name,
    baseSkill: node.baseSkill,
    connections: node.connections,
    description: extractedData,
    id: getFirstLetters(node.name) + node.id,
    maxPoints: node.maxPoints,
    allocatedPoints: 0,
    nodeType,
    x: node.x + centerX,
    y: node.y + centerY,
    manaCostValues,
    luckyHitValues,
  };

  extractedValues.forEach((valueArray, index) => {
    updatedNode[`values${index + 1}`] = valueArray;
  });

  if (parent) {
    updatedNode.connections = updatedNode.connections.filter(
      (connection) => connection !== parent.name
    );
  }

  const children = [];
  for (const connection of updatedNode.connections) {
    const child = data.find((child) => child.name === connection);
    if (child) {
      const processedChild = processNode(
        child,
        updatedNode,
        data,
        processedNodes
      );
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
    const dataArray = Object.keys(data).map((key) => ({
      ...data[key],
      name: key,
    }));
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
