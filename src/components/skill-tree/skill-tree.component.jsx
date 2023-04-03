import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { select, pointer } from "d3-selection";

import SkillNodeComponent from "../skill-node/skill-node.component.jsx";
import sorcererData from "../../data/sorcerer-test.json";

import "./skill-tree.styles.scss";

// Images
import sorcererSpellImagesMap from "../../helpers/sorcerer-spell-images-map";
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
  const sorcererSpellImagesContext = require.context(
    "../../assets/spell-images/sorcerer",
    true,
    /\.(png|jpe?g|svg)$/
  );

  const [totalAllocatedPoints, setTotalAllocatedPoints] = useState(0);
  const [nodeState, setNodeState] = useState();

  // useEffect(() => {}, []);

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
            child.parent = node; // Add the parent property to the child node
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
    console.log("total nodes: " + nodes.length);

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
      const targetNode = nodes.find((n) => n.name === target.name);

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
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      })
      .attr("stroke", (d) => getLinkAttributes(d.source, d.target).linkFill)
      .attr(
        "stroke-width",
        (d) => getLinkAttributes(d.source, d.target).linkWidth
      )
      .attr("fill", "none");

    const linkElements = containerGroup.selectAll("path").data(links);

    // Create custom node attributes based on nodeType
    const getNodeAttributes = (nodeType) => {
      switch (nodeType) {
        case "nodeHub":
          return {
            class: "node node-hub",
            image: nodeHubImage_inactive,
            frameWidth: 250,
            frameHeight: 250,
            frameTranslateX: -125,
            frameTranslateY: -125,
            spellWidth: 150 / 1.65,
            spellHeight: 150 / 1.65,
            spellTranslateX: -75 / 1.65,
            spellTranslateY: -75 / 1.65,
          };
        case "activeSkill":
          return {
            class: "node active-skill-node",
            image: activeSkillImage_inactive,
            frameWidth: 150,
            frameHeight: 150,
            frameTranslateX: -75,
            frameTranslateY: -75,
            spellWidth: 150 / 1.65,
            spellHeight: 150 / 1.65,
            spellTranslateX: -75 / 1.65,
            spellTranslateY: -75 / 1.65,
          };
        case "activeSkillBuff":
          return {
            class: "node active-skill-buff-node",
            image: activeSkillBuffImage_inactive,
            frameWidth: 100,
            frameHeight: 100,
            frameTranslateX: -50,
            frameTranslateY: -50,
            spellWidth: 90 / 1.65,
            spellHeight: 90 / 1.65,
            spellTranslateX: -45 / 1.65,
            spellTranslateY: -45 / 1.65,
            rotation: 45,
            rotationCenterX: 90 / 1.65 / 2,
            rotationCenterY: 90 / 1.65 / 2,
          };
        case "passiveSkill":
          return {
            class: "node passive-skill-node",
            image: passiveSkillImage_inactive,
            frameWidth: 80,
            frameHeight: 80,
            frameTranslateX: -40,
            frameTranslateY: -40,
            spellWidth: 120 / 1.65,
            spellHeight: 120 / 1.65,
            spellTranslateX: -60 / 1.65,
            spellTranslateY: -60 / 1.65,
          };
        default:
          return {
            class: "node",
            image: "need-default-image-here",
            frameWidth: 50,
            frameHeight: 50,
            frameTranslateX: -25,
            frameTranslateY: -25,
            spellWidth: 150 / 1.65,
            spellHeight: 150 / 1.65,
            spellTranslateX: -75 / 1.65,
            spellTranslateY: -75 / 1.65,
          };
      }
    };

    //################################################# CONTINUE HERE!!!!!!!!!!!!!!!!!!!!!!!!
    // The CORE nodes image replacment and activation is not working
    const isNodeActive = (node) => {
      if (node.nodeType === "nodeHub") {
        return true;
      }
      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      return (
        isNodeActive(parentNode) &&
        parentNode.allocatedPoints >= parentNode.requiredPoints
      );
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

    // basic circle for debugging only
    //nodeGroup.append("circle").attr("r", 10).attr("fill", "grey");

    // Apply the skill frame images to the nodes
    nodeGroup
      .append("image")
      .attr("class", "skill-node-image")
      .attr("href", (d) => getNodeAttributes(d.nodeType).image)
      .attr("width", (d) => getNodeAttributes(d.nodeType).frameWidth)
      .attr("height", (d) => getNodeAttributes(d.nodeType).frameHeight)
      .attr("transform", (d) => {
        const { frameTranslateX: translateX, frameTranslateY: translateY } =
          getNodeAttributes(d.nodeType);
        return `translate(${translateX}, ${translateY})`;
      });

    // Find the spell images for the parents and their children
    const getSpellImage = (node) => {
      const nodeName = node.name.toLowerCase();
      if (node.nodeType === "activeSkillBuff") {
        if (node.parent) {
          return getSpellImage(node.parent);
        }
      }
      return sorcererSpellImagesMap[nodeName];
    };

    // Apply the spell images to the nodes
    nodeGroup
      .append("image")
      .attr("class", "skill-node-image")
      .attr("href", (d) => getSpellImage(d))
      .attr("width", (d) => getNodeAttributes(d.nodeType).spellWidth)
      .attr("height", (d) => getNodeAttributes(d.nodeType).spellHeight)
      .attr("transform", (d) => {
        const {
          spellTranslateX,
          spellTranslateY,
          rotation,
          rotationCenterX,
          rotationCenterY,
        } = getNodeAttributes(d.nodeType);
        // Apply rotation around the center point if it exists
        const rotateTransform = rotation
          ? `rotate(${rotation}, ${rotationCenterX}, ${rotationCenterY})`
          : "";
        return `translate(${spellTranslateX}, ${spellTranslateY}) ${rotateTransform}`;
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
      .attr("y", (d) => getNodeAttributes(d.nodeType).frameHeight / 4 - 10)
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

    const isNodeClickable = (node) => {
      if (node.nodeType === "nodeHub") {
        return false;
      }

      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      const totalPoints = calculateTotalAllocatedPoints(nodes);
      // console.log("parentNode: " + parentNode.name);
      // console.log("totalPoints: " + totalPoints);
      // console.log("parent required points: " + parentNode.requiredPoints);
      // console.log(
      //   "totalPoints is bigger?: " + totalPoints >= parentNode.requiredPoints
      // );

      if (node.connections && node.connections.length > 0) {
        if (parentNode.name === "Basic") {
          return true;
        }

        if (
          parentNode.nodeType === "nodeHub" &&
          totalPoints >= parentNode.requiredPoints
        ) {
          return true;
        }

        return parentNode && parentNode.allocatedPoints >= 1;
      }
      return true;
    };

    // Update the nodeHubs' links on point allocation based on their requirements
    function updateNodeHubLinkColors(updatedTotalAllocatedPoints) {
      console.log("LEFUT");
      // Filter links that have a nodeHub as their target
      const nodeHubLinks = linkElements.filter(
        (d) => d.target.nodeType === "nodeHub"
      );
      console.log("nodeHubLinks: " + nodeHubLinks);

      // Update the stroke color based on total allocated points
      nodeHubLinks.attr("stroke", (d) => {
        const targetRequiredPoints = d.target.requiredPoints;

        if (updatedTotalAllocatedPoints >= targetRequiredPoints) {
          return "#c7170b"; // Change the color if the requirement is met
        } else {
          return "#2a3031"; // Default color
        }
      });
    }

    // Get node image based on state and type
    function getNodeImage(nodeType, isActive) {
      switch (nodeType) {
        case "nodeHub":
          return isActive ? nodeHubImage_active : nodeHubImage_inactive;
        case "activeSkill":
          return isActive ? activeSkillImage_active : activeSkillImage_inactive;
        case "activeSkillBuff":
          return isActive
            ? activeSkillBuffImage_inactive
            : activeSkillBuffImage_inactive; // TODO need to create an active image for skillBuffs
        case "passiveSkill":
          return isActive
            ? passiveSkillImage_inactive
            : passiveSkillImage_inactive; // TODO Need to create an active image for the passice skills
        case "default":
          return passiveSkillImage_inactive;
        default:
          console.error("Unknown node type:", nodeType);
          return "path/to/defaultImage.svg"; // Return a default image in case of an unknown node type
      }
    }

    function onPointAllocated(node) {
      // Find the node in the nodes array
      const targetNode = nodes.find((n) => n.name === node.name);

      // Allocate the point
      targetNode.allocatedPoints += 1;

      // Update the total points spent counter
      const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);
      setTotalAllocatedPoints(updatedTotalAllocatedPoints);

      // Update node hub link colors
      updateNodeHubLinkColors(updatedTotalAllocatedPoints);

      console.log("total points spent: " + totalAllocatedPoints);

      // Replace the frame image and add a classname if the node is active
      nodeGroup
        .filter((d) => d.name === node.name)
        .select("image.skill-node-image")
        .classed("allocated-node", true)
        .attr("width", getNodeAttributes(node.nodeType).width)
        .attr("height", getNodeAttributes(node.nodeType).frameHeight)
        .attr("transform", () => {
          const { frameTranslateX: translateX, frameTranslateY: translateY } =
            getNodeAttributes(node.nodeType);
          return `translate(${translateX}, ${translateY})`;
        })
        .attr(
          "href",
          getNodeImage(
            node.nodeType,
            isNodeActive(node) || targetNode.allocatedPoints > 0
          )
        );

      // Find the parentNode (nodeHub) of the allocated node
      const parentNode = nodes.find(
        (n) => n.nodeType === "nodeHub" && node.connections.includes(n.name)
      );

      // console.log("PARENT IS: " + parentNode.name);

      if (parentNode && parentNode.nodeType === "nodeHub") {
        // Update the nodeHub's image
        nodeGroup
          .filter((d) => d.name === parentNode.name)
          .select("image.skill-node-image")
          .attr(
            "href",
            getNodeImage(parentNode.nodeType, isNodeActive(parentNode))
          );
      }
    }

    // Update the link color between the nodes
    function updateLinkColor(source, target) {
      // Find the link associated with the node
      const linkToUpdate = linkElements.filter(
        (d) => d.source.name === source.name && d.target.name === target.name
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
      if (!isNodeClickable(node)) {
        return;
      }

      if (node.allocatedPoints < node.maxPoints) {
        onPointAllocated(node);
      }

      // Add additional class name to the nodes
      nodeGroup
        .filter((d) => d.name === node.name)
        .classed("allocated-node", true);

      // Change link color between the allocated node and its parent
      // const parentNode = nodes.find((n) => n.name === node.connections[0]);
      // updateLinkColor(parentNode, node);

      node.connections.forEach((connection) => {
        const parentNode = nodes.find((n) => n.name === connection);
        updateLinkColor(parentNode, node);

        if (parentNode && parentNode.nodeType === "nodeHub") {
          nodeGroup
            .filter((d) => d.name === parentNode.name)
            .select("image.skill-node-image")
            .attr(
              "href",
              getNodeImage(parentNode.nodeType, isNodeActive(parentNode))
            );
        }
      });
    };

    // console.log("nodes: " + nodes);
    setNodeState(nodes);
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
