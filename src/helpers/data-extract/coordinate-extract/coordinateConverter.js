const fs = require("fs");

function main() {
  fs.readFile("../node-coords-output.json", "utf8", (err, input1) => {
    if (err) {
      console.error(`Error reading input1.json: ${err}`);
      return;
    }

    fs.readFile("./coordinates.json", "utf8", (err, input2) => {
      if (err) {
        console.error(`Error reading input2.json: ${err}`);
        return;
      }

      const inputData1 = JSON.parse(input1);
      const inputData2 = JSON.parse(input2);

      if (!inputData1.nodes) {
        console.error("Input data 1 does not have a 'nodes' property.");
        return;
      }

      if (!Array.isArray(inputData2)) {
        console.error("Input data 2 is not an array.");
        return;
      }

      console.log(`Number of objects in input1: ${inputData1.nodes.length}`);
      console.log(`Number of objects in input2: ${inputData2.length}`);

      const outputData = inputData2.map((node2, index) => {
        const node1 = inputData1.nodes[index];

        if (node1) {
          return {
            ...node2,
            x: node1.x,
            y: node1.y,
          };
        } else {
          console.warn(
            `No matching coordinates found for node with name "${node2.name}"`
          );
          return node2;
        }
      });

      const outputFilePath = "./converted-coords.json";

      fs.writeFile(
        outputFilePath,
        JSON.stringify(outputData, null, 2),
        (err) => {
          if (err) {
            console.error(`Error writing output file: ${err}`);
          } else {
            console.log(
              `Converted data successfully saved to ${outputFilePath}`
            );
          }
        }
      );
    });
  });
}

main();
