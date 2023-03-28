import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import SkillNodeComponent from "../skill-node/skill-node.component.jsx";
import sorcererData from "../../data/sorcerer-test.json";

import "./skill-tree.styles.scss";

// Images
import passiveSkillImage from "../../assets/node_circle_inactive_large.png";
import activeSkillImage from "../../assets/node_square_inactive_large.png";
import nodeHubImage from "../../assets/node_diamond_inactive_large.png";

const containerStyles = {
  width: "100%",
  height: "100vh",
};

const SkillTreeComponent = ({
  skillData,
  allocatedPoints,
  activeSkills,
  onSkillClick,
  onSkillActivation,
}) => {
  const treeContainerRef = useRef(null);
  const treeGroupRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const nodeSize = { x: 150, y: 150 };
  const skillTreeData = sorcererData;
  const containerWidth = treeContainerRef.current.clientWidth;
  const containerHeight = treeContainerRef.current.clientHeight;
  const initialTransform = d3.zoomIdentity.translate(
    containerWidth / 2,
    containerHeight / 2
  );

  useEffect(() => {}, []);

  useEffect(() => {
    if (!skillTreeData) return;

    const svg = d3.select(treeContainerRef.current);
    svg.selectAll("*").remove();

    // Helper function to flatten the structure
    const flatten = (data) => {
      const nodes = [];
      const links = [];

      function traverse(node) {
        nodes.push(node);

        if (node.children) {
          node.children.forEach((child) => {
            links.push({ source: node, target: child });
            traverse(child);
          });
        }
      }

      traverse(data);

      return { nodes, links };
    };

    // Extract nodes and links directly from the skillTreeData object
    const { nodes, links } = flatten(skillTreeData);

    // Define the zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        containerGroup.attr("transform", event.transform);
      });

    // Add the zoom behavior to the svg
    svg.call(zoom);

    // Create a container group element
    const containerGroup = svg.append("g").attr("class", "svg-container");
    // Fix the first zoom & drag incorrect behavior with applying the initial transform values
    svg.call(zoom.transform, initialTransform);

    // Draw links
    containerGroup
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "svg-container")
      .attr("d", (d) => {
        // console.log("d: " + d.text);
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      })
      .attr("stroke", "white")
      .attr("fill", "none");

    // Draw nodes
    const nodeGroup = containerGroup
      .selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "skill-node")
      // Set individual node positions on the canvas
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      // Set the default placement of the tree and zoom level at firstl load
      .call(zoom.transform, initialTransform);

    // basic circle for debugging only
    //nodeGroup.append("circle").attr("r", 10).attr("fill", "grey");

    // Add a custom image to the skill nodes based on nodeType
    const getNodeImageAttributes = (nodeType) => {
      switch (nodeType) {
        case "passiveSkill":
          return {
            image: passiveSkillImage,
            width: 100,
            height: 100,
            translateX: -50,
            translateY: -50,
          };
        case "activeSkill":
          return {
            image: activeSkillImage,
            width: 180,
            height: 180,
            translateX: -90,
            translateY: -90,
          };
        case "nodeHub":
          return {
            image: nodeHubImage,
            width: 200,
            height: 200,
            translateX: -100,
            translateY: -100,
          };
        default:
          return {
            image: "need-default-image-here",
            width: 50,
            height: 50,
            translateX: -25,
            translateY: -25,
          };
      }
    };

    // Apply the images to the nodes
    nodeGroup
      .append("image")
      .attr("href", (d) => getNodeImageAttributes(d.nodeType).image)
      .attr("width", (d) => getNodeImageAttributes(d.nodeType).width)
      .attr("height", (d) => getNodeImageAttributes(d.nodeType).height)
      .attr("transform", (d) => {
        const { translateX, translateY } = getNodeImageAttributes(d.nodeType);
        return `translate(${translateX}, ${translateY})`;
      });
    // .attr("transform", "translate(-25, -25)");

    // Add the skill name text to the nodes
    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5rem")
      .attr("class", "node-text")
      .text((d) => d.name);

    // console.log("===== " + nodeGroup.attr);
  }, [skillTreeData]);

  return (
    <div className="skill-tree" style={containerStyles}>
      <svg ref={treeContainerRef} width="100%" height="100%">
        <g ref={treeGroupRef}></g>
      </svg>
    </div>
  );
};

export default SkillTreeComponent;
