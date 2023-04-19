import React, { useRef, useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as d3 from "d3";
import { select, pointer } from "d3-selection";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";
import SkillTreeContext from "../../contexts/skill-tree.context.jsx";

// Components
import Navbar from "../navbar-top/navbar-top.component.jsx";
import Footer from "../footer/footer.component.jsx";
import SkillTooltipComponent from "../skill-tooltip/skill-tooltip.component.jsx";

// Utility functions
import {
  getNodeAttributes,
  getSkillCategoryImage,
} from "../../helpers/skill-tree/get-node-attributes.js";
import {
  getSpellImage,
  addLinkPatterns,
  updateNodeHubsPointCounterAfterPointChange,
  updateParentNodesChildrenAfterPointChange,
  updateNodeHubImageAfterPointChange,
  activateDirectChildrenAfterPointChange,
  updateNodeFrameOnPointChange,
} from "../../helpers/skill-tree/skill-tree-utils.js";
import { getNodeImage } from "../../helpers/skill-tree/get-node-attributes.js";
import {
  parseSkillTreeUrl,
  generateSkillTreeUrl,
} from "../../helpers/skill-tree/state-management-utils.js";

import barbarianData from "../../data/barbarian.json";
import necromancerData from "../../data/necromancer.json";
import sorcererData from "../../data/sorcerer.json";
import rogueData from "../../data/rogue.json";
import druidData from "../../data/druid.json";

import "./skill-tree.styles.scss";

// Images
import nodeHubLinkImage from "../../assets/skill-tree/node-line-category.webp";
import nodeLinkImage from "../../assets/skill-tree/node-line-skill.webp";
import nodeHubLinkImage_active from "../../assets/skill-tree/node-line-category-active-fill.webp";

const containerStyles = {
  width: "100%",
  height: "100vh",
};

const SkillTreeComponent = () => {
  const { selectedClass } = useContext(ClassSelectionContext);

  const treeContainerRef = useRef(null);
  const treeGroupRef = useRef(null);
  const [skillTreeData, setSkillTreeData] = useState(null);
  const { skillTreeState, setSkillTreeState } = useContext(SkillTreeContext);
  // const skillTreeData = skillTreeState[selectedClass];

  // Get the URL parameters and navigate function from react-router-dom
  const { className } = useParams();
  const navigate = useNavigate();

  // Tooltip related states
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const [totalAllocatedPoints, setTotalAllocatedPoints] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const generateUpdatedSkillTreeData = (
    selectedClass,
    classname,
    skillTreeStateFromUrl
  ) => {
    let initialData;

    switch (selectedClass) {
      case "Barbarian":
        initialData = barbarianData;
        break;
      case "Necromancer":
        initialData = necromancerData;
        break;
      case "Sorcerer":
        initialData = sorcererData;
        break;
      case "Rogue":
        initialData = rogueData;
        break;
      case "Druid":
        initialData = druidData;
        break;
      default:
        initialData = barbarianData;
        break;
    }

    console.log("initialData -> ", initialData);
    const updatedSkillTreeData = JSON.parse(JSON.stringify(initialData));
    console.log("updatedSkillTreeData -> ", updatedSkillTreeData);

    console.log(
      "skillTreeStateFromUrl[selectedClass] -> ",
      skillTreeStateFromUrl[selectedClass]
    );

    if (classname === selectedClass && skillTreeStateFromUrl[selectedClass]) {
      const traverseAndUpdatePoints = (node) => {
        if (skillTreeStateFromUrl[selectedClass][node.id]) {
          node.allocatedPoints = skillTreeStateFromUrl[selectedClass][node.id];
        }

        if (node.children) {
          node.children.forEach(traverseAndUpdatePoints);
        }
      };

      traverseAndUpdatePoints(updatedSkillTreeData);
    }

    return updatedSkillTreeData;
  };

  // Handle class selection
  useEffect(() => {
    if (!selectedClass) return;

    const { classname, skillTreeState: skillTreeStateFromUrl } =
      parseSkillTreeUrl(window.location.pathname);
    console.log("className -> ", classname);

    const updatedSkillTreeData = generateUpdatedSkillTreeData(
      selectedClass,
      classname,
      skillTreeStateFromUrl
    );
    console.log("skillTreeStateFromUrl -> ", skillTreeStateFromUrl);
    console.log("updatedSkillTreeData -> ", updatedSkillTreeData);

    setSkillTreeData(updatedSkillTreeData);
    setSkillTreeState((prevState) => {
      const updatedState = {
        ...prevState,
        [selectedClass]: updatedSkillTreeData,
      };

      return updatedState;
    });

    const url = generateSkillTreeUrl(
      selectedClass,
      skillTreeState[selectedClass] || {}
    );
    console.log("url -> ", url);
    navigate(url);
  }, [selectedClass, navigate, setSkillTreeState]);

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

    addLinkPatterns(svg, nodeHubLinkImage_active);

    // Helper function to flatten the structure
    const flatten = (data) => {
      const nodes = [];
      const links = [];

      function traverse(node) {
        // nodes.push(node);
        nodes.push({ ...node, allocatedPoints: node.allocatedPoints || 0 });

        if (node.children) {
          node.children.forEach((child) => {
            child.parent = node;
            links.push({ source: node, target: child });
            traverse(child);
          });
        } else if (node.connections) {
          node.connections.forEach((connection) => {
            const parentNode = nodes.find((n) => n.name === connection);
            if (parentNode) {
              links.push({ source: parentNode, target: node });
            }
          });
        }
      }

      traverse(data);

      // Get the unique nodes by name
      const nodesWithMultipleParents = nodes.filter(
        (node, index, self) =>
          index === self.findIndex((n) => n.name === node.name)
      );

      return {
        nodes: nodesWithMultipleParents,
        links: [...links],
      };
    };

    // Extract nodes and links directly from the skillTreeData object
    const { nodes, links } = flatten(skillTreeData);
    console.log("total nodes: " + nodes.length);

    // Define the zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.2, 3])
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

    // Create custom link properties based on link type
    // TODO need to extract this to a separate file
    const getLinkAttributes = (source, target, totalPoints) => {
      const linkType = getLinkType(source, target);

      if (linkType === "hubLink") {
        return {
          class: "hub-link",
          //linkFill: getLinkColor(source, target, totalPoints),
          linkWidth: 260,
          linkHeight: 260,
          image: nodeHubLinkImage,
          image_active: nodeHubLinkImage_active,
        };
      } else {
        return {
          class: "node-link",
          //linkFill: getLinkColor(source, target, totalPoints),
          linkWidth: 70,
          linkHeight: 70,
          image: nodeLinkImage,
          image_active: nodeHubLinkImage_active,
        };
      }
    };

    // ========================================= DRAW LINKS
    let linkElements = drawLinksBetweenNodes();
    let activeLinkElements = drawActiveLinksBetweenNodes();

    // TODO need to extract this to a helper file
    function drawLinksBetweenNodes() {
      containerGroup
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr(
          "class",
          (d) =>
            getLinkAttributes(d.source, d.target, totalAllocatedPoints).class
        )
        .attr("d", (d) => {
          const sourceX = d.source.x * 5 - 1775;
          const sourceY = d.source.y * 5 - 1045;
          const targetX = d.target.x * 5 - 1775;
          const targetY = d.target.y * 5 - 1045;
          return `M${sourceX},${sourceY} L${targetX},${targetY}`;
        })
        .attr(
          "stroke-width",
          (d) =>
            getLinkAttributes(d.source, d.target, totalAllocatedPoints)
              .linkWidth
        )
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
          const sourceX = d.source.x * 5 - 1775;
          const sourceY = d.source.y * 5 - 1045;
          const targetX = d.target.x * 5 - 1775;
          const targetY = d.target.y * 5 - 1045;

          // Custom images for the links
          const linkWidth = getLinkAttributes(
            d.source,
            d.target,
            totalAllocatedPoints
          ).linkWidth;
          const linkHeight = getLinkAttributes(
            d.source,
            d.target,
            totalAllocatedPoints
          ).linkHeight;

          const linkImage = getLinkAttributes(
            d.source,
            d.target,
            totalAllocatedPoints
          ).image;
          const angle =
            (Math.atan2(targetY - sourceY, targetX - sourceX) * 180) / Math.PI;
          const id = `linkImagePattern${i}`;

          // Calculate the link's center point
          const centerX = sourceX + (targetX - sourceX) / 2;
          const centerY = sourceY + (targetY - sourceY) / 2;

          // Calculate the image's half width and height
          const halfWidth = linkWidth / 2;
          const halfHeight = linkHeight / 2;

          // Calculate the translation offset based on the angle
          const offsetX =
            halfWidth * Math.cos(angle * (Math.PI / 180)) -
            halfHeight * Math.sin(angle * (Math.PI / 180));
          const offsetY =
            halfWidth * Math.sin(angle * (Math.PI / 180)) +
            halfHeight * Math.cos(angle * (Math.PI / 180));

          // Calculate the translation
          const translateX = centerX - offsetX;
          const translateY = centerY - offsetY;

          svg
            .select("defs")
            .append("pattern")
            .attr("id", id)
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", linkWidth)
            .attr("height", linkHeight)
            .attr("viewBox", `0 0 ${linkWidth} ${linkHeight}`)
            .attr("preserveAspectRatio", "xMidYMid slice")
            .attr(
              "patternTransform",
              `translate(${translateX}, ${translateY}) rotate(${angle})`
            )
            .append("image")
            .attr("href", linkImage)
            .attr(
              "width",
              getLinkAttributes(d.source, d.target, totalAllocatedPoints)
                .linkWidth
            )
            .attr(
              "height",
              getLinkAttributes(d.source, d.target, totalAllocatedPoints)
                .linkHeight
            );
          return `url(#${id})` || "none";
        });

      return containerGroup.selectAll("path").data(links);
    }

    function drawActiveLinksBetweenNodes() {
      containerGroup
        .selectAll(".activePath")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "activePath")
        .attr("clip-path", (d, i) => `url(#clip${i})`) // For link path progress
        .attr("d", (d) => {
          const sourceX = d.source.x * 5 - 1775;
          const sourceY = d.source.y * 5 - 1045;
          const targetX = d.target.x * 5 - 1775;
          const targetY = d.target.y * 5 - 1045;
          return `M${sourceX},${sourceY} L${targetX},${targetY}`;
        })
        .attr(
          "stroke-width",
          (d) =>
            getLinkAttributes(d.source, d.target, totalAllocatedPoints)
              .linkWidth
        )
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
          const sourceX = d.source.x * 5 - 1775;
          const sourceY = d.source.y * 5 - 1045;
          const targetX = d.target.x * 5 - 1775;
          const targetY = d.target.y * 5 - 1045;

          // Custom images for the links
          const linkWidth = getLinkAttributes(
            d.source,
            d.target,
            totalAllocatedPoints
          ).linkWidth;
          const linkHeight = getLinkAttributes(
            d.source,
            d.target,
            totalAllocatedPoints
          ).linkHeight;

          const linkImage = getLinkAttributes(
            d.source,
            d.target,
            totalAllocatedPoints
          ).image_active;
          const angle =
            (Math.atan2(targetY - sourceY, targetX - sourceX) * 180) / Math.PI;
          const id = `activeLinkImagePattern${i}`;

          // Calculate the link's center point
          const centerX = sourceX + (targetX - sourceX) / 2;
          const centerY = sourceY + (targetY - sourceY) / 2;

          // Calculate the image's half width and height
          const halfWidth = linkWidth / 2;
          const halfHeight = linkHeight / 2;

          // Calculate the translation offset based on the angle
          const offsetX =
            halfWidth * Math.cos(angle * (Math.PI / 180)) -
            halfHeight * Math.sin(angle * (Math.PI / 180));
          const offsetY =
            halfWidth * Math.sin(angle * (Math.PI / 180)) +
            halfHeight * Math.cos(angle * (Math.PI / 180));

          // Calculate the translation
          const translateX = centerX - offsetX;
          const translateY = centerY - offsetY;

          svg
            .select("defs")
            .append("pattern")
            .attr("id", id)
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", linkWidth)
            .attr("height", linkHeight)
            .attr("viewBox", `0 0 ${linkWidth} ${linkHeight}`)
            .attr("preserveAspectRatio", "xMidYMid slice")
            .attr(
              "patternTransform",
              `translate(${translateX}, ${translateY}) rotate(${angle})`
            )
            .append("image")
            .attr("href", linkImage)
            .attr("width", linkWidth)
            .attr("height", linkHeight);

          return `url(#${id})` || "none";
        })
        .style("opacity", 0);

      return containerGroup.selectAll(".activePath").data(links);
    }

    function updateLinkElements() {
      return containerGroup.selectAll("path").data(links);
    }

    // Update the links' image based on activation
    function updateLinksOnNodeAllocation(totalPointsss) {
      let totalPoints = calculateTotalAllocatedPoints(nodes);
      activeLinkElements.each(function (d) {
        const sourceNode = nodes.find((n) => n.name === d.source.name);
        const targetNode = nodes.find((n) => n.name === d.target.name);

        let isActive = false;

        if (
          sourceNode.nodeType === "nodeHub" &&
          targetNode.nodeType === "nodeHub"
        ) {
          isActive = totalPoints >= targetNode.requiredPoints;
        } else {
          isActive = targetNode.allocatedPoints > 0;
        }

        // Update the opacity of the active link
        d3.select(this).style("opacity", isActive ? 1 : 0);

        console.log("Link image updated");
      });
    }

    // Check if a node can be clicked
    const isNodeActive = (node, allocatedPoints = null) => {
      if (node.nodeType === "nodeHub") {
        return true;
      }

      if (!node.connections) {
        console.warn(`Node ${node.name} has no connections.`);
        return false;
      }

      const parentNode = nodes.find((n) => node.connections.includes(n.name));
      if (!parentNode) {
        return false;
      }

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
      .classed(
        "active-node",
        (d) => d.nodeType !== "nodeHub" && isNodeActive(d)
      )
      // Set individual node positions on the canvas
      .attr(
        "transform",
        // (d) => `translate(${d.x}, ${d.y})`
        // (d) => `translate(${d.x * 10}, ${d.y * 10})`
        (d) => `translate(${d.x * 5 - 1775}, ${d.y * 5 - 1045})`
      )
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

    // Apply the nodeHub skill category images to the nodes
    nodeGroup
      .filter((d) => d.nodeType === "nodeHub") // Only select nodes with nodeType === "nodeHub"
      .append("image")
      .attr("class", "skill-category-image")
      .attr("href", (d) => getSkillCategoryImage(d).image)
      .attr(
        "width",
        (d) => getNodeAttributes(d.nodeType).skillCategoryImageWidth
      )
      .attr(
        "height",
        (d) => getNodeAttributes(d.nodeType).skillCategoryImageHeight
      )
      .attr("transform", (d) => {
        const {
          skillCategoryTranslateX: translateX,
          skillCategoryTranslateY: translateY,
        } = getNodeAttributes(d.nodeType);
        return `translate(${translateX}, ${translateY})`;
      });

    // Apply the spell images to the nodes
    nodeGroup
      .append("image")
      .attr("class", "spell-node-image")
      .attr("href", (d) => getSpellImage(d, selectedClass))
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
      .attr("dy", "3.2rem")
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
      .attr("y", (d) => getNodeAttributes(d.nodeType).frameHeight / 4 - 10)
      .text((d) =>
        d.nodeType !== "nodeHub" && d.maxPoints > 1
          ? `${d.allocatedPoints}/${d.maxPoints}`
          : ""
      );

    // Update the point indicator on click
    nodeGroup
      .on("click", (event, d) => {
        handleNodeClick(d);
        d3.select(event.currentTarget)
          .select(".point-indicator")
          .text((d) =>
            d.nodeType !== "nodeHub" && d.maxPoints > 1
              ? `${d.allocatedPoints}/${d.maxPoints}`
              : ""
          );
      })
      .on("contextmenu", (event, d) => {
        event.preventDefault(); // Prevent the browser context menu from showing up
        handleNodeRightClick(d);
        d3.select(event.currentTarget)
          .select(".point-indicator")
          .text((d) =>
            d.nodeType !== "nodeHub" && d.maxPoints > 1
              ? `${d.allocatedPoints}/${d.maxPoints}`
              : ""
          );
      });

    // Get the total points spent on tree
    function calculateTotalAllocatedPoints(nodes) {
      let result = nodes.reduce(
        (total, node) => total + node.allocatedPoints,
        0
      );
      setTotalAllocatedPoints(result);
      console.log("Total points: " + result);
      return result;
    }

    const isNodeClickable = (node) => {
      if (node.nodeType === "nodeHub") {
        return false;
      }

      // Check if the node is disabled due to the last children logic
      if (node.nodeType === "activeSkillUpgrade" && node.disabled) {
        return false;
      }

      const parentNode = nodes.find((n) => node.connections.includes(n.name));
      const totalPoints = calculateTotalAllocatedPoints(nodes);

      if (node.connections && node.connections.length > 0) {
        if (parentNode && parentNode.name === "Basic") {
          return true;
        }

        if (
          parentNode.nodeType === "nodeHub" &&
          totalPoints >= parentNode.requiredPoints
        ) {
          return true;
        }
      }

      if (parentNode && parentNode.allocatedPoints >= 1) {
        return true;
      }

      return false;
    };

    function findNodeById(node, id) {
      if (node.id === id) {
        return node;
      } else if (node.children) {
        for (const child of node.children) {
          const foundNode = findNodeById(child, id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    }

    // Update the tree state on point allocation and also generate a unique url for it
    function updateSkillTreeStateAndURL(updatedNode, nodes) {
      // Update the allocated points in skillTreeState
      setSkillTreeState((prevState) => {
        const updatedState = { ...prevState };
        const mainNode = updatedState[selectedClass];

        const currentNode = findNodeById(mainNode, updatedNode.id);
        if (currentNode) {
          currentNode.allocatedPoints = updatedNode.allocatedPoints;
          console.log("Updated Node -> ", currentNode);
        } else {
          console.log("Node not found");
        }

        const newUrl = generateSkillTreeUrl(
          selectedClass,
          updatedState[selectedClass].children
        );

        window.history.replaceState(null, "", newUrl);
        return updatedState;
      });
    }

    function onPointAllocated(node) {
      console.log("Allocated node:", node);
      const isAllocate = true;

      // Find the node in the nodes array
      const targetNode = nodes.find((n) => n.name === node.name);

      // Allocate the point
      targetNode.allocatedPoints += 1;

      // Update the total points spent counter
      const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);

      // Update linkElements selection
      linkElements = updateLinkElements();

      // Update link images
      updateLinksOnNodeAllocation(totalAllocatedPoints);

      // Replace the frame image and add a classname if the node is active
      updateNodeFrameOnPointChange(
        nodeGroup,
        node,
        getNodeAttributes,
        getNodeImage,
        isNodeActive,
        targetNode,
        isAllocate
      );

      // Activate direct children nodes if the allocated node is a non-nodeHub node
      activateDirectChildrenAfterPointChange(nodes, node, containerGroup);

      // Find the parentNode (nodeHub) of the allocated node
      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      // Update the nodeHub's image
      updateNodeHubImageAfterPointChange(
        parentNode,
        nodeGroup,
        getNodeImage,
        isNodeActive
      );

      // Update the active-node class for parentNode's children nodes
      updateParentNodesChildrenAfterPointChange(
        nodes,
        parentNode,
        containerGroup,
        isAllocate
      );

      // Update the point counter on the nodeHubs
      updateNodeHubsPointCounterAfterPointChange(
        nodeGroup,
        updatedTotalAllocatedPoints
      );

      // Update the skillTreeState and URL after allocating points
      updateSkillTreeStateAndURL(targetNode, nodes);
    }

    function onPointDeallocated(node) {
      // Prevent removing points from a node with 0 points allocated
      if (node.allocatedPoints === 0) {
        return;
      }
      const isAllocate = false;
      console.log("Deallocated node:", node);

      // Find the node in the nodes array
      const targetNode = nodes.find((n) => n.name === node.name);

      // Deallocate the point
      targetNode.allocatedPoints -= 1;

      // Update the total points spent counter
      const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);

      // Update link images
      updateLinksOnNodeAllocation(totalAllocatedPoints);

      // Replace the frame image and add a classname if the node is active
      updateNodeFrameOnPointChange(
        nodeGroup,
        node,
        getNodeAttributes,
        getNodeImage,
        isNodeActive,
        targetNode,
        isAllocate
      );

      // Activate direct children nodes if the allocated node is a non-nodeHub node
      activateDirectChildrenAfterPointChange(nodes, node, containerGroup);

      // Find the parentNode (nodeHub) of the allocated node
      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      // Update the nodeHub's image
      updateNodeHubImageAfterPointChange(
        parentNode,
        nodeGroup,
        getNodeImage,
        isNodeActive
      );

      // Update the active-node class for parentNode's children nodes
      updateParentNodesChildrenAfterPointChange(
        nodes,
        parentNode,
        containerGroup,
        isAllocate
      );

      // Update the point counter on the nodeHubs
      updateNodeHubsPointCounterAfterPointChange(
        nodeGroup,
        updatedTotalAllocatedPoints
      );

      // Update the skillTreeState and URL after allocating points
      updateSkillTreeStateAndURL(targetNode, nodes);
    }

    // Handle the click on a node (point allocation)
    const handleNodeClick = (node) => {
      if (!isNodeClickable(node)) {
        return;
      }

      // Check if the node is a last child and the other last child has points allocated
      const lastChildren = nodes.filter(
        (n) =>
          n.baseSkill === node.baseSkill && n.nodeType === "activeSkillUpgrade"
      );

      if (lastChildren.length === 2) {
        const otherLastChild = lastChildren.find((n) => n.name !== node.name);

        if (otherLastChild && otherLastChild.allocatedPoints > 0) {
          return;
        }
      }

      if (node.allocatedPoints < node.maxPoints) {
        onPointAllocated(node);
      } else {
        return;
      }

      // Add additional class name to the nodes
      nodeGroup
        .filter((d) => d.name === node.name)
        .classed("allocated-node", true);
    };

    // Handle the right-click on a node (point deallocation)
    const handleNodeRightClick = (node) => {
      if (!isNodeClickable(node)) {
        return;
      }

      const getParentNode = (currentNode, allNodes) => {
        const childrenNames = currentNode.children
          ? currentNode.children.map((child) => child.name)
          : [];

        const parentNodeName = currentNode.connections.find(
          (connectionName) => !childrenNames.includes(connectionName)
        );

        return allNodes.find((node) => node.name === parentNodeName);
      };

      const getDirectChildren = (actualNode) => {
        return nodes.filter(
          (childNode) =>
            actualNode.children &&
            actualNode.children.find((child) => child.name === childNode.name)
        );
      };

      const hasAllocatedPointsInChildren = (actualNode) => {
        const children = getDirectChildren(actualNode);
        return children.some((child) => child.allocatedPoints > 0);
      };

      const parentNode = getParentNode(node, nodes);
      // Check if parent node is nodeHub, it is active and check if the parent has 0 allocated points
      if (
        parentNode &&
        (parentNode.nodeType !== "nodeHub" ||
          parentNode.totalAllocatedPoints >= parentNode.requiredPoints) &&
        parentNode.allocatedPoints === 0
      ) {
        return;
      }

      // Check if the node has more than 1 allocated point and any of its direct children has an allocated point
      if (node.allocatedPoints - 1 >= 1 && hasAllocatedPointsInChildren(node)) {
        onPointDeallocated(node);
      }
      // Check if the node has no children with allocated points
      else if (
        !hasAllocatedPointsInChildren(node) &&
        node.allocatedPoints > 0
      ) {
        onPointDeallocated(node);
      }

      // Remove additional class name from the nodes
      nodeGroup
        .filter((d) => d.name === node.name)
        .classed("allocated-node", false);
    };

    // Add a text to the nodeHubs to show the remaining/required points for activation
    function getRemainingPoints(allocatedPoints, requiredPoints) {
      return Math.max(0, requiredPoints - allocatedPoints);
    }

    nodeGroup
      .append("text")
      .attr("class", "nodeHub-counter")
      .attr("text-anchor", "middle")
      .attr("dy", "-1rem")
      .text((d) => {
        if (d.nodeType !== "nodeHub") {
          return "";
        }
        const remainingPoints = getRemainingPoints(
          totalAllocatedPoints,
          d.requiredPoints
        );
        return `${totalAllocatedPoints}/${d.requiredPoints}`;
      });

    // ========================================= TOOLTIP
    nodeGroup
      .on("mouseenter", (event, d) => {
        setTooltipData(d);
        // console.log(d);
        setTooltipPosition({ x: event.pageX, y: event.pageY });
        // toggleTooltipVisibility();
        setTooltipVisible(true);
      })
      .on("mouseleave", () => {
        setTooltipData(null);
        setTooltipPosition(null);
        // toggleTooltipVisibility();
        setTooltipVisible(false);
      });
  }, [skillTreeData]);

  return (
    <div className="skill-tree" style={containerStyles}>
      <Navbar />
      {/* <Footer /> */}
      <svg ref={treeContainerRef} width="100%" height="100%">
        <g ref={treeGroupRef}></g>
      </svg>
      <SkillTooltipComponent
        nodeData={tooltipData}
        position={tooltipPosition}
        descriptionValues={tooltipData && tooltipData.values}
        descriptionExtraValues={tooltipData && tooltipData.extraValues}
        spellImage={tooltipData && getSpellImage(tooltipData, selectedClass)}
        visible={tooltipVisible}
      />
    </div>
  );
};

// Find the spell images for the parents and their children

function hasActiveDirectChildren(node, nodes) {
  const childrenNodes = nodes.filter(
    (n) => n.connections && n.connections.includes(node.name)
  );

  return childrenNodes.some((childNode) => childNode.allocatedPoints > 0);
}

export default SkillTreeComponent;
