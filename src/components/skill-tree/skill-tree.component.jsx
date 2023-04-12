import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { select, pointer } from "d3-selection";

import SkillNodeComponent from "../skill-node/skill-node.component.jsx";
import SkillTooltipComponent from "../skill-tooltip/skill-tooltip.component.jsx";
import {
  getNodeAttributes,
  getSkillCategoryImages,
} from "../../helpers/skill-tree/getNodeAttributes";
import { getNodeImage } from "../../helpers/skill-tree/getNodeAttributes";

import sorcererData from "../../data/sorcerer.json";
// import sorcererData from "../../data/sorcerer-test.json";
// import sorcererData from "../../data/playground.json";

import "./skill-tree.styles.scss";

// Images
import sorcererSpellImagesMap from "../../helpers/sorcerer-spell-images-map";
import nodeHubLinkImage from "../../assets/skill-tree/node-line-category.webp";
import nodeLinkImage from "../../assets/skill-tree/node-line-skill.webp";

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

  // Tooltip related states
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const [totalAllocatedPoints, setTotalAllocatedPoints] = useState(0);
  const [nodeState, setNodeState] = useState();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const toggleTooltipVisibility = () => {
    setTooltipVisible(!tooltipVisible);
  };

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

    addLinkPatterns(svg, nodeHubLinkImage);
    // addLinkMarkers(svg, nodeHubLinkImage);

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

    const getLinkColor = (source, target) => {
      return shouldLinkBeActive(source, target) ? "#c7170b" : "#2a3031";
    };

    function shouldLinkBeActive(source, target) {
      if (source.nodeType === "nodeHub" && target.nodeType === "nodeHub") {
        const totalPoints = calculateTotalAllocatedPoints(nodes);
        return totalPoints >= target.requiredPoints;
      } else {
        return target.allocatedPoints > 0;
      }
    }

    // Create custom link properties based on link type
    // TODO need to extract this to a separate file
    const getLinkAttributes = (source, target) => {
      const linkType = getLinkType(source, target);

      if (linkType === "hubLink") {
        return {
          class: "hub-link",
          linkFill: getLinkColor(source, target),
          linkWidth: 260,
          linkHeight: 260,
          image: nodeHubLinkImage,
        };
      } else {
        return {
          class: "node-link",
          linkFill: getLinkColor(source, target),
          linkWidth: 70,
          linkHeight: 70,
          image: nodeLinkImage,
        };
      }
    };

    // ========================================= DRAW LINKS
    const linkElements = drawLinksBetweenNodes();
    // updateLinkColor();

    // TODO need to extract this to a helper file
    function drawLinksBetweenNodes() {
      containerGroup
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("class", (d) => getLinkAttributes(d.source, d.target).class)
        .attr("d", (d) => {
          const sourceX = d.source.x * 5 - 1775;
          const sourceY = d.source.y * 5 - 1045;
          const targetX = d.target.x * 5 - 1775;
          const targetY = d.target.y * 5 - 1045;
          return `M${sourceX},${sourceY} L${targetX},${targetY}`;
        })
        .attr(
          "stroke-width",
          (d) => getLinkAttributes(d.source, d.target).linkWidth
        )
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
          const sourceX = d.source.x * 5 - 1775;
          const sourceY = d.source.y * 5 - 1045;
          const targetX = d.target.x * 5 - 1775;
          const targetY = d.target.y * 5 - 1045;

          // Custom images for the links
          const linkWidth = getLinkAttributes(d.source, d.target).linkWidth;
          const linkHeight = getLinkAttributes(d.source, d.target).linkHeight;

          const linkImage = getLinkAttributes(d.source, d.target).image;
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
            .attr("width", getLinkAttributes(d.source, d.target).linkWidth)
            .attr("height", getLinkAttributes(d.source, d.target).linkHeight);
          return `url(#${id})`;
        });

      return containerGroup.selectAll("path").data(links);
    }

    // Create custom node attributes based on nodeType
    // const getNodeAttributes = getNodeAttributes;

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

    const skillCategoryImages = getSkillCategoryImages();
    // Apply the nodeHub skill category images to the nodes
    nodeGroup
      .append("image")
      .attr("class", "skill-category-image")
      .attr("href", (d) =>
        d.nodeType === "nodeHub" ? getSkillCategoryImages(d).image : ""
      )
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

      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      const totalPoints = calculateTotalAllocatedPoints(nodes);

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
      // Filter links that have a nodeHub as their target
      const nodeHubLinks = linkElements.filter(
        (d) => d.target.nodeType === "nodeHub"
      );

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

    function onPointAllocated(node) {
      console.log("Allocated node:", node);
      const isAllocate = true;

      // Find the node in the nodes array
      const targetNode = nodes.find((n) => n.name === node.name);

      // Allocate the point
      targetNode.allocatedPoints += 1;

      // Update the total points spent counter
      const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);

      // Update node hub link colors
      updateNodeHubLinkOnPointChange(
        updateNodeHubLinkColors,
        updatedTotalAllocatedPoints,
        node,
        nodes,
        updateLinkColor
      );

      // Replace the frame image and add a classname if the node is active
      updateNodeFrameOnPointChange(
        nodeGroup,
        node,
        getNodeAttributes,
        // frameTranslateX, // TODO need to handle these values
        // frameTranslateY, // TODO need to handle these values
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

      // Update node hub link colors
      updateNodeHubLinkOnPointChange(
        updateNodeHubLinkColors,
        updatedTotalAllocatedPoints,
        node,
        nodes,
        updateLinkColor
      );

      // Replace the frame image and add a classname if the node is active
      updateNodeFrameOnPointChange(
        nodeGroup,
        node,
        getNodeAttributes,
        // frameTranslateX, // TODO need to handle these values
        // frameTranslateY, // TODO need to handle these values
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
    }

    // function isLinkActive(source, target) {
    //   if (source.nodeType === "nodeHub") {
    //     return totalAllocatedPoints >= source.requiredPoints;
    //   }
    //   return source.allocatedPoints > 0;
    // }

    // Update the link color between the nodes
    function updateLinkColor(source, target) {
      if (!source || !target) {
        return;
      }

      // Find the link associated with the node
      const linkToUpdate = linkElements.filter(
        (d) => d.source.name === source.name && d.target.name === target.name
      );

      // Update the stroke color based on allocated points
      linkToUpdate.attr("stroke", (d) => {
        const color = getLinkColor(source, target);
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

      node.connections.forEach((connection) => {
        const parentNode = nodes.find((n) => n.name === connection);
      });
    };

    // Handle the right-click on a node (point deallocation)
    const handleNodeRightClick = (node) => {
      if (!isNodeClickable(node)) {
        return;
      }

      // Check if the node has any direct child nodes with allocated points
      const hasChildWithAllocatedPoints = nodes.some(
        (childNode) =>
          childNode.connections &&
          childNode.connections.includes(node.name) &&
          childNode.allocatedPoints > 0
      );

      // If the node has a direct child with allocated points, prevent deallocation
      if (hasChildWithAllocatedPoints) {
        return;
      }

      // If the node has a parent with allocated points and no siblings with allocated points, prevent deallocation
      const parentNode = nodes.find(
        (n) => n.connections && n.connections.includes(node.name)
      );
      const hasParentWithAllocatedPoints =
        parentNode && parentNode.allocatedPoints > 0;

      if (
        hasParentWithAllocatedPoints &&
        node.allocatedPoints === 1 &&
        parentNode.connections
      ) {
        const siblings = parentNode.connections.filter(
          (connection) => connection !== node.name
        );
        const siblingsHaveAllocatedPoints = siblings.some((siblingName) => {
          const siblingNode = nodes.find((n) => n.name === siblingName);
          return siblingNode && siblingNode.allocatedPoints > 0;
        });

        if (!siblingsHaveAllocatedPoints) {
          return;
        }
      }

      if (node.allocatedPoints > 0) {
        onPointDeallocated(node);
      }

      // Remove additional class name from the nodes
      nodeGroup
        .filter((d) => d.name === node.name)
        .classed("allocated-node", false);

      node.connections.forEach((connection) => {
        const parentNode = nodes.find((n) => n.name === connection);
      });
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
        toggleTooltipVisibility();
      })
      .on("mouseleave", () => {
        setTooltipData(null);
        setTooltipPosition(null);
        toggleTooltipVisibility();
      });

    // console.log("nodes: " + nodes);
    setNodeState(nodes);
  }, [skillTreeData]);

  // Update node hub link colors
  function updateNodeHubLinkOnPointChange(
    updateNodeHubLinkColors,
    updatedTotalAllocatedPoints,
    node,
    nodes,
    updateLinkColor
  ) {
    updateNodeHubLinkColors(updatedTotalAllocatedPoints);
    // Update the link colors for all connected nodes
    node.connections.forEach((connection) => {
      const parentNode = nodes.find((n) => n.name === connection);
      if (parentNode) {
        updateLinkColor(parentNode, node);
      }
    });
  }

  return (
    <div className="skill-tree" style={containerStyles}>
      <svg ref={treeContainerRef} width="100%" height="100%">
        <g ref={treeGroupRef}></g>
      </svg>
      <SkillTooltipComponent
        nodeData={tooltipData}
        position={tooltipPosition}
        descriptionValues={tooltipData && tooltipData.values}
        descriptionExtraValues={tooltipData && tooltipData.extraValues}
        spellImage={tooltipData && getSpellImage(tooltipData)}
        visible={tooltipVisible}
      />
    </div>
  );
};

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

// Update the point counter on the nodeHubs
function updateNodeHubsPointCounterAfterPointChange(
  nodeGroup,
  updatedTotalAllocatedPoints
) {
  nodeGroup.selectAll(".nodeHub-counter").text((d) => {
    if (d.nodeType !== "nodeHub") {
      return "";
    }
    return `${updatedTotalAllocatedPoints}/${d.requiredPoints}`;
  });
}

// Update the active-node class for parentNode's children nodes
function updateParentNodesChildrenAfterPointChange(
  nodes,
  parentNode,
  containerGroup,
  isAllocate
) {
  const parentNodeChildrenNodes = nodes.filter(
    (n) => n.connections && n.connections.includes(parentNode.name)
  );

  parentNodeChildrenNodes.forEach((childNode) => {
    if (childNode.nodeType !== "nodeHub") {
      containerGroup
        .selectAll("g.node")
        .filter((d) => d.name === childNode.name)
        .classed("active-node", isAllocate);
    }
  });
}

// Update the nodeHub's image
function updateNodeHubImageAfterPointChange(
  parentNode,
  nodeGroup,
  getNodeImage,
  isNodeActive
) {
  if (parentNode && parentNode.nodeType === "nodeHub") {
    nodeGroup
      .filter((d) => d.name === parentNode.name)
      .select("image.skill-node-image")
      .attr(
        "href",
        getNodeImage(parentNode.nodeType, isNodeActive(parentNode))
      );
  }
}

// Activate direct children nodes if the allocated node is a non-nodeHub node
function activateDirectChildrenAfterPointChange(nodes, node, containerGroup) {
  const childrenNodes = nodes.filter(
    (n) => n.connections && n.connections.includes(node.name)
  );

  childrenNodes.forEach((childNode) => {
    if (childNode.nodeType !== "nodeHub") {
      containerGroup
        .selectAll("g.node")
        .filter((d) => {
          return d.name === childNode.name;
        })
        .classed("active-node", true);
    }
  });
}

// Replace the frame image and add a classname if the node is active
function updateNodeFrameOnPointChange(
  nodeGroup,
  node,
  getNodeAttributes,
  // frameTranslateX,
  // frameTranslateY,
  getNodeImage,
  isNodeActive,
  targetNode,
  isAllocate
) {
  nodeGroup
    .filter((d) => d.name === node.name)
    .select("image.skill-node-image")
    .classed("allocated-node", isAllocate)
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
        isNodeImageActive(node, targetNode, isAllocate, isNodeActive)
      )
    );
}

function isNodeImageActive(node, targetNode, isAllocate, isNodeActive) {
  const isActive = isNodeActive(node);
  if (isAllocate) {
    return isActive || targetNode.allocatedPoints >= 0;
  } else {
    return isActive && targetNode.allocatedPoints > 0;
  }
}

function hasActiveDirectChildren(node, nodes) {
  const childrenNodes = nodes.filter(
    (n) => n.connections && n.connections.includes(node.name)
  );

  return childrenNodes.some((childNode) => childNode.allocatedPoints > 0);
}

function addLinkPatterns(svg, linkImage) {
  const pattern = svg
    .append("defs")
    .append("pattern")
    .attr("id", "linkImagePattern")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 312) // Adjust this value according to the size of your image
    .attr("height", 84) // Adjust this value according to the size of your image
    .attr("viewBox", "0 0 312 84") // Make sure the viewBox values match the width and height
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("patternTransform", "rotate(90)")
    .append("image")
    .attr("href", linkImage)
    .attr("width", 312) // Adjust this value according to the size of your image
    .attr("height", 84); // Adjust this value according to the size of your image
}

function addLinkMarkers(svg, linkImage) {
  const marker = svg
    .append("defs")
    .append("marker")
    .attr("id", "linkImageMarker")
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", 312)
    .attr("markerHeight", 84)
    .attr("viewBox", "0 0 312 84")
    .attr("refX", 0)
    .attr("refY", 42) // Half of the marker height
    .attr("orient", "auto")
    .attr("preserveAspectRatio", "xMidYMid slice")
    .append("image")
    .attr("href", linkImage)
    .attr("width", 312)
    .attr("height", 84);
}

export default SkillTreeComponent;
