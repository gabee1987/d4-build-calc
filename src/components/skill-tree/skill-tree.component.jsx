import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { select, pointer } from "d3-selection";

import SkillNodeComponent from "../skill-node/skill-node.component.jsx";
import sorcererData from "../../data/sorcerer-test.json";

import "./skill-tree.styles.scss";

// Images
import nodeHubImage_inactive from "../../assets/node_diamond_inactive_large_web.png";
import nodeHubImage_active from "../../assets/node_diamond_active_large_web.png";
import activeSkillImage_inactive from "../../assets/node_square_inactive_large_web.png";
import activeSkillImage_active from "../../assets/node_square_active_large_web.png";
import activeSkillBuffImage_inactive from "../../assets/node-active-skill-buff-node-large-web.png";
import passiveSkillImage_inactive from "../../assets/passive-skill-node-large-web.png";

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
  const skillTreeData = sorcererData;

  const [totalAllocatedPoints, setTotalAllocatedPoints] = useState(0);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!skillTreeData) return;

    const containerWidth = treeContainerRef.current.clientWidth;
    const containerHeight = treeContainerRef.current.clientHeight;
    const initialTransform = d3.zoomIdentity.translate(
      containerWidth / 2,
      containerHeight / 2
    );

    const svg = d3.select(treeContainerRef.current);
    svg.selectAll("*").remove();

    // Helper function to flatten the structure
    const flatten = (data) => {
      const nodes = [];
      const links = [];

      function traverse(node) {
        // nodes.push(node);
        nodes.push({ ...node, allocatedPoints: node.allocatedPoints || 0 });

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
      .scaleExtent([0.2, 2])
      .on("zoom", (event) => {
        containerGroup.attr("transform", event.transform);
      });

    // Add the zoom behavior to the svg
    svg.call(zoom);

    // Create a container group element
    const containerGroup = svg.append("g").attr("class", "svg-container");
    // Fix the first zoom & drag incorrect behavior with applying the initial transform values
    svg.call(zoom.transform, initialTransform);

    // Get the link types based on the source and target node type
    const getLinkType = (source, target) => {
      if (source.nodeType === "nodeHub" && target.nodeType === "nodeHub") {
        return "hubLink";
      }
      return "nodeLink";
    };

    const getLinkColor = (source, target) => {
      // const sourceNode = nodes.find((n) => n.id === source.id);
      const targetNode = nodes.find((n) => n.id === target.id);

      if (targetNode.allocatedPoints > 0) {
        return "#c7170b";
      }
      return "#2a3031";
    };

    // Create custom link properties based on link type
    const getLinkAttributes = (source, target) => {
      const linkType = getLinkType(source, target);

      if (linkType === "hubLink") {
        return {
          class: "hub-link",
          //fill: "url(#hubPattern)", // Reference to the pattern you want to use
          //strokeColor: "url(#hubPattern)", // Reference to the pattern you want to use
          linkFill: getLinkColor(source, target),
          linkWidth: 60,
          linkHeight: 60,
        };
      } else {
        return {
          class: "node-link",
          //fill: "url(#nodePattern)", // Reference to the pattern you want to use
          //strokeColor: "url(#nodePattern)", // Reference to the pattern you want to use
          //linkFill: "url(#nodePattern)",
          linkFill: getLinkColor(source, target),
          linkWidth: 20,
          linkHeight: 60,
        };
      }
    };

    const calculateAngle = (source, target) => {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      return Math.atan2(dy, dx);
    };

    const calculateDistance = (source, target) => {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // ========================================= DRAW LINKS
    containerGroup
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", (d) => getLinkAttributes(d.source, d.target).class)
      .attr("d", (d) => {
        // console.log("d: " + d.text);
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        // var xcontrol = targetX / 2 + sourceX / 2;
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      })
      .attr("stroke", (d) => getLinkAttributes(d.source, d.target).linkFill)
      // .attr("stroke", (d) => "url(#hubPattern)")
      // .attr("fill", (d) => getLinkAttributes(d.source, d.target).linkFill)
      // .attr("fill", "#e60000")
      .attr(
        "stroke-width",
        (d) => getLinkAttributes(d.source, d.target).linkWidth
      )
      //.attr("stroke-dasharray", "50 50") // Modify these numbers according to your desired pattern repetition
      //.attr("stroke-dashoffset", 0); // Modify this number to control the starting position of the pattern;
      .attr("fill", "none");

    const linkElements = containerGroup.selectAll("path").data(links);

    // create node classnames based on their state
    function getNodeClassNames(node) {}

    // Create custom node attributes based on nodeType
    const getNodeAttributes = (nodeType) => {
      switch (nodeType) {
        case "nodeHub":
          return {
            class: "node node-hub",
            image: nodeHubImage_inactive,
            width: 250,
            height: 250,
            translateX: -125,
            translateY: -125,
          };
        case "activeSkill":
          return {
            class: "node active-skill-node",
            image: activeSkillImage_inactive,
            width: 150,
            height: 150,
            translateX: -75,
            translateY: -75,
          };
        case "activeSkillBuff":
          return {
            class: "node active-skill-buff-node",
            image: activeSkillBuffImage_inactive,
            width: 100,
            height: 100,
            translateX: -50,
            translateY: -50,
          };
        case "passiveSkill":
          return {
            class: "node passive-skill-node",
            image: passiveSkillImage_inactive,
            width: 100,
            height: 100,
            translateX: -50,
            translateY: -50,
          };
        default:
          return {
            class: "node",
            image: "need-default-image-here",
            width: 50,
            height: 50,
            translateX: -25,
            translateY: -25,
          };
      }
    };

    const isNodeActive = (node) => {
      if (node.nodeType === "nodeHub") {
        return false;
      }
      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      if (parentNode.name === "Basic") {
        return true;
      }

      return parentNode.allocatedPoints >= parentNode.requiredPoints;
    };

    // ========================================= DRAW NODES
    const nodeGroup = containerGroup
      .selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", (d) => getNodeAttributes(d.nodeType).class)
      // .classed("active-node", (d) => isNodeActive(d))
      // Set individual node positions on the canvas
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      // Set the default placement of the tree and zoom level at firstl load
      .call(zoom.transform, initialTransform);

    // CONTINUE HERE !!!!!!!!!!!!!!!!!!!!!!!
    // nodeGroup
    //   .selectAll("g.node")
    //   .data(nodes)
    //   .classed("active-node", (d) => isNodeActive(d));

    // basic circle for debugging only
    //nodeGroup.append("circle").attr("r", 10).attr("fill", "grey");

    // Apply the images to the nodes
    nodeGroup
      .append("image")
      .attr("class", "skill-node-image")
      .attr("href", (d) => getNodeAttributes(d.nodeType).image)
      .attr("width", (d) => getNodeAttributes(d.nodeType).width)
      .attr("height", (d) => getNodeAttributes(d.nodeType).height)
      .attr("transform", (d) => {
        const { translateX, translateY } = getNodeAttributes(d.nodeType);
        return `translate(${translateX}, ${translateY})`;
      });

    // Add the skill name text to the nodes
    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      // .attr("y", (d) => getNodeImageAttributes(d.nodeType).height + 1)
      .attr("dy", "2.5rem")
      .attr("class", "node-text")
      .text((d) => d.name);

    // ========================================= NODE BEHAVIOR/FUNCTIONALITY

    // Disable double-click zoom on nodes
    select("svg")
      .selectAll("g.node")
      .on("dblclick", (event) => {
        event.stopPropagation();
      });

    // Add the points indicator to the nodes
    nodeGroup
      .append("text")
      .attr("class", "point-indicator")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5rem")
      // .attr("x", (d) => getNodeImageAttributes(d.nodeType).width - 160)
      .attr("y", (d) => getNodeAttributes(d.nodeType).height / 4 - 10)
      .text((d) =>
        d.nodeType !== "nodeHub" ? `${d.allocatedPoints}/${d.maxPoints}` : ""
      );

    // Update the point indicator on click
    nodeGroup.on("click", (event, d) => {
      handleNodeClick(d);
      d3.select(event.currentTarget)
        .select(".point-indicator")
        .text(`${d.allocatedPoints}/${d.maxPoints}`);
    });

    // Get the total points spent on tree
    function calculateTotalAllocatedPoints(nodes) {
      return nodes.reduce((total, node) => total + node.allocatedPoints, 0);
    }

    // Check if a node is clikcable(active)
    const isNodeClickable = (node, totalPoints) => {
      if (node.nodeType === "nodeHub") {
        return false;
      }

      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      if (calculateTotalAllocatedPoints(nodes) >= parentNode.requiredPoints) {
        return true;
      }

      if (node.connections && node.connections.length > 0) {
        if (parentNode.name === "Basic") {
          return true;
        }

        if (
          parentNode.nodeType === "nodeHub" &&
          calculateTotalAllocatedPoints(nodes) >= parentNode.requiredPoints
        ) {
          return true;
        }

        return parentNode && parentNode.allocatedPoints >= 1;
      }

      return true;
    };

    // Update the nodeHubs' links on point allocation based on their requirements
    function updateNodeHubLinkColors() {
      // Filter links that have a nodeHub as their target
      const nodeHubLinks = linkElements.filter(
        (d) => d.target.nodeType === "nodeHub"
      );

      // Update the stroke color based on total allocated points
      nodeHubLinks.attr("stroke", (d) => {
        const targetRequiredPoints = d.target.requiredPoints;

        if (calculateTotalAllocatedPoints(nodes) >= targetRequiredPoints) {
          return "#c7170b"; // Change the color if the requirement is met
        } else {
          return "#2a3031"; // Default color
        }
      });
    }

    function onPointAllocated(node) {
      // Find the node in the nodes array
      const targetNode = nodes.find((n) => n.id === node.id);

      // Allocate the point
      targetNode.allocatedPoints += 1;

      // Update the total points spent counter
      setTotalAllocatedPoints((prevTotalAllocatedPoints) => {
        const updatedTotalAllocatedPoints =
          calculateTotalAllocatedPoints(nodes); // TODO need to remove this function and change the color changing behavior

        // Update node hub link colors
        updateNodeHubLinkColors(updatedTotalAllocatedPoints);
        console.log("total points spent: " + totalAllocatedPoints);

        return updatedTotalAllocatedPoints;
      });

      // Replace the image and add a classname if the node is active
      nodeGroup
        .filter((d) => d.id === node.id)
        .classed("allocated-node", true)
        .each(function (d) {
          const isActive = isNodeActive(d);
          const newHref = isActive
            ? activeSkillImage_active
            : activeSkillImage_inactive;

          const nodeAttributes = getNodeAttributes(d.nodeType);

          // Create a new image element
          const newImage = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
          );
          newImage.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            newHref
          );

          newImage.setAttribute("width", nodeAttributes.width);
          newImage.setAttribute("height", nodeAttributes.height);
          newImage.setAttribute("x", d.x - nodeAttributes.width / 2);
          newImage.setAttribute("y", d.y - nodeAttributes.height / 2);

          // Replace the old image element with the new one
          this.parentNode.replaceChild(newImage, this);
        });
    }

    function updateLinkColor(source, target) {
      // Find the link associated with the node
      const linkToUpdate = linkElements.filter(
        (d) => d.source.id === source.id && d.target.id === target.id
      );

      // Update the stroke color based on allocated points
      linkToUpdate.attr("stroke", (d) => {
        const color = getLinkColor(source, target);
        console.log("Link color:", color);
        return color;
      });
    }

    // Handle the click on a node (point allocation)
    const handleNodeClick = (node) => {
      if (!isNodeClickable(node, totalAllocatedPoints)) {
        return;
      }

      if (node.allocatedPoints < node.maxPoints) {
        onPointAllocated(node);
      }

      // Add additional class name to the nodes
      nodeGroup.filter((d) => d.id === node.id).classed("allocated-node", true);

      // Change link color between the allocated node and its parent
      const parentNode = nodes.find((n) => n.name === node.connections[0]);
      updateLinkColor(parentNode, node);
    };
  }, [skillTreeData]);

  return (
    <div className="skill-tree" style={containerStyles}>
      <svg ref={treeContainerRef} width="100%" height="100%">
        {/* Custom style for the links */}
        {/* <defs>
          <pattern
            id="nodePattern"
            patternUnits="userSpaceOnUse"
            width="30"
            height="30"
            patternTransform="rotate(45)"
          >
            <rect width="30" height="30" fill="#3b4343" />
          </pattern>
        </defs> */}
        {/* <defs>
          <pattern
            id="hubPattern"
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
            patternTransform="rotate(45)"
          >
            <path d="M0,0 L50,0 L25,50z" fill="url(#customGradient)" />
            <path d="M0,0 L50,0 L25,50z" fill="#ee3800" />
            <image href="./../assets/circle-oval.svg" width="20" height="20" />
          </pattern>
          <pattern
            id="nodePattern"
            patternUnits="userSpaceOnUse"
            width="100"
            height="100"
            patternTransform="rotate(45)"
          >
            <path d="M0,0 L50,0 L25,50z" fill="#ee3800" />
            <image href="path/to/your/image.svg" width="100" height="100" />
          </pattern>
        </defs> */}
        <g ref={treeGroupRef}></g>
      </svg>
    </div>
  );
};

export default SkillTreeComponent;
