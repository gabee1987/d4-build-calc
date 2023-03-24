import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";
import * as d3 from "d3";

import SkillNodeComponent from "../skill-node/skill-node.component.jsx";
import sorcererData from "../../data/sorcerer-test.json";
import { convertClassDataToTreeData } from "../../helpers/class-data-converter.js";

import styles from "./skill-tree.styles.scss";

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

  // const skillTreeData = createSkillTreeData(skillData);
  const skillTreeData = sorcererData;

  useEffect(() => {}, []);

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    // console.log(nodeDatum);
    console.log("nodeDatum.attributes: " + nodeDatum.name);
    console.log("nodeDatum.id: " + nodeDatum.id);
    console.log("nodeDatum.nodeType: " + nodeDatum.nodeType);
    console.log("nodeDatum.x coord: " + nodeDatum.x);
    console.log("nodeDatum.y coord: " + nodeDatum.y);

    const isActive = false;
    const points = 0;

    return (
      // <g transform={`translate(${nodeDatum.x}, ${nodeDatum.y})`}>
      <SkillNodeComponent
        skill={nodeDatum}
        isActive={isActive}
        points={points}
        onClick={() => {
          toggleNode();
          onSkillClick(nodeDatum.attributes.id, points + 1);
        }}
        onActivation={() => onSkillActivation(nodeDatum.attributes.id)}
      />
      //</g>
    );
  };

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
    const containerGroup = svg.append("g").attr("class", "container");

    // Draw links
    containerGroup
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", (d) => {
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
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    nodeGroup.append("circle").attr("r", 10).attr("fill", "grey");

    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5rem")
      .attr("class", "node-text")
      .text((d) => d.name);

    // console.log("===== " + nodeGroup.attr);
  }, [skillTreeData]);

  return (
    <div className={styles.skillTree} style={containerStyles}>
      <svg ref={treeContainerRef} width="100%" height="100%">
        <g ref={treeGroupRef}></g>
      </svg>
    </div>
  );
};

export default SkillTreeComponent;
