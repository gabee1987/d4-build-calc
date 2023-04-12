const fs = require("fs");

const inputData = require("../../data-conversion/input.json"); // Replace "./input.json" with the path to your JSON data file
const outputFilePath = "coordinates.json";

function extractCoordinates(node) {
  if (!node) {
    return [];
  }

  const coordinates = [
    {
      name: node.name,
      x: node.x,
      y: node.y,
    },
  ];

  if (node.children) {
    for (const child of node.children) {
      coordinates.push(...extractCoordinates(child));
    }
  }

  return coordinates;
}

function processData(node) {
  let allCoordinates = [];

  if (node.children) {
    for (const child of node.children) {
      allCoordinates.push(...extractCoordinates(child));
    }
  }

  return allCoordinates;
}

const outputData = processData(inputData);

fs.writeFile(outputFilePath, JSON.stringify(outputData, null, 2), (err) => {
  if (err) {
    console.log("Error writing file:", err);
  } else {
    console.log("Output saved to", outputFilePath);
  }
});
