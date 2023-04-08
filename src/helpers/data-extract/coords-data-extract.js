// Run with node coords-data-extract.js
const fs = require("fs");
const { JSDOM } = require("jsdom");

fs.readFile("input.html", "utf8", (err, htmlString) => {
  if (err) {
    console.error("Error reading input.html:", err);
    return;
  }

  const dom = new JSDOM(htmlString);
  const { document } = dom.window;

  const nodeDivs = document.querySelectorAll("div[x][y]");
  const linkDivs = document.querySelectorAll("div[x1][y1][x2][y2]");

  const nodes = Array.from(nodeDivs).map((node) => {
    const x = parseFloat(node.getAttribute("x"));
    const y = parseFloat(node.getAttribute("y"));
    const className = node.getAttribute("class");

    return { x, y, className };
  });

  const links = Array.from(linkDivs).map((link) => {
    const x1 = parseFloat(link.getAttribute("x1"));
    const y1 = parseFloat(link.getAttribute("y1"));
    const x2 = parseFloat(link.getAttribute("x2"));
    const y2 = parseFloat(link.getAttribute("y2"));
    const className = link.getAttribute("class");

    return { source: { x: x1, y: y1 }, target: { x: x2, y: y2 }, className };
  });

  const output = {
    nodes,
    links,
  };

  fs.writeFile("output.json", JSON.stringify(output, null, 2), (err) => {
    if (err) {
      console.error("Error writing output.json:", err);
      return;
    }

    console.log("output.json has been saved!");
  });
});
