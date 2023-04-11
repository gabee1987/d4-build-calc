const fs = require("fs");

function processDescription(desc) {
  const values = [];
  const extraValues = [];
  const tags = [];

  const valueRegex = /{([^}]+)}/g;
  const tagRegex = /Tags: (.+)(\.|\n)/;

  let valueMatches = [...desc.matchAll(valueRegex)];
  let tagMatches = tagRegex.exec(desc);

  for (const match of valueMatches) {
    let series = match[1].split("/");
    if (values.length === 0) {
      values.push(...series);
    } else {
      extraValues.push(...series);
    }
  }

  if (tagMatches && tagMatches[1]) {
    tags.push(...tagMatches[1].split(", "));
  }

  return { values, extraValues, tags };
}

function createNode(name, data, id) {
  if (!data) {
    console.error(`Error: Data for "${name}" not found.`);
    return null;
  }

  const { values, extraValues, tags } = processDescription(data.description);

  const node = {
    name: name,
    connections: data.connections || [],
    description: data.description.replace(/{[^}]+}/g, "{#}"),
    id: data.id || id,
    maxPoints: data.maxPoints || 0,
    nodeType: data.nodeType || "activeSkill",
    values: values,
    extraValues: extraValues,
    tags: tags,
    x: data.x || 0,
    y: data.y || 0,
    children: [],
  };

  if (data.baseSkill) {
    node.baseSkill = data.baseSkill;
  }

  return node;
}

function buildChildren(parentName, inputData, outputData) {
  const parentNode = createNode(parentName, inputData[parentName], 200);

  if (!parentNode) {
    console.error(`Error: Data for "${parentNode}" not found.`);
    return null;
  }
  for (const childName of parentNode.connections) {
    if (!outputData[childName]) {
      outputData[childName] = true;
      const childNode = createNode(childName, inputData[childName]);
      parentNode.children.push(childNode);
      buildChildren(childName, inputData, outputData);
    }
  }
  return parentNode;
}

const inputData = require("./input.js");

const outputData = {};
const rootNode = buildChildren("Basic", inputData, outputData);

const outputFile = "smart-output.json";
const outputContent = `module.exports = ${JSON.stringify(rootNode, null, 2)};`;
fs.writeFileSync(outputFile, outputContent);
console.log(`Data successfully written to ${outputFile}`);
