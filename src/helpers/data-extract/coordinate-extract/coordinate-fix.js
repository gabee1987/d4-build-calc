const fs = require("fs");

// Read the input JSON file
const inputData = JSON.parse(fs.readFileSync("input.json"));

// Read the coordinates JSON file
const coordinatesData = JSON.parse(fs.readFileSync("input-coordinates.json"));

// Replace the coordinates in the input JSON file
function replaceCoordinates(node) {
  const coordinates = coordinatesData.find(
    (coord) => coord.skillName === node.name
  );
  if (coordinates) {
    node.x = coordinates.x;
    node.y = coordinates.y;
  }
  if (node.children) {
    node.children.forEach((child) => replaceCoordinates(child));
  }
}

replaceCoordinates(inputData);

// Write the modified input JSON file
fs.writeFileSync("output.json", JSON.stringify(inputData, null, 2));
console.log("Output saved to", "output.json");
