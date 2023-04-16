const fs = require("fs");

// Read the sorcererData input file
const classData = require("./connections-input");

// Read the treeData input file
const treeData = JSON.parse(fs.readFileSync("treeData.json"));

// Replace the connections arrays in the treeData
function replaceConnections(node) {
  const skillNode = classData[node.name];
  if (skillNode) {
    node.connections = skillNode.connections;
  }
  if (node.children) {
    node.children.forEach((child) => replaceConnections(child));
  }
}

// Process the treeData
treeData.children.forEach((child) => replaceConnections(child));

// Write the modified treeData to an output file
fs.writeFileSync("output.json", JSON.stringify(treeData, null, 2));
console.log("Output saved to", "output.json");
