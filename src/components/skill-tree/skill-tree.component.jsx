import React, { useRef, useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as d3 from "d3";
import { select, pointer } from "d3-selection";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";
import { SkillTreeContext } from "../../contexts/skill-tree-state-management.context.jsx";

// Components
import Navbar from "../navbar-top/navbar-top.component.jsx";
import Footer from "../footer/footer.component.jsx";
import SkillTooltipComponent from "../skill-tooltip/skill-tooltip.component.jsx";

// Util functions
import {
  getSpellImage,
  updateNodeHubsPointCounterAfterPointChange,
  updateParentNodesChildrenAfterPointChange,
  updateNodeHubImageAfterPointChange,
  activateDirectChildrenAfterPointChange,
  updateNodeFrameOnPointChange,
} from "../../helpers/skill-tree/skill-tree-utils.js";
import {
  addLinkPatterns,
  drawLinksBetweenNodes,
  drawActiveLinksBetweenNodes,
  updateLinkElements,
} from "../../helpers/skill-tree/tree-link-utils.js";

import {
  getNodeAttributes,
  getSkillCategoryImage,
  getNodeImage,
} from "../../helpers/skill-tree/get-node-attributes.js";

// State Management
import {
  generatePointsParam,
  parsePointsParam,
  updateSkillTree,
} from "../../helpers/skill-tree/state-management-utils.js";

import barbarianData from "../../data/barbarian.json";
import necromancerData from "../../data/necromancer.json";
import sorcererData from "../../data/sorcerer.json";
import rogueData from "../../data/rogue.json";
import druidData from "../../data/druid.json";

import "./skill-tree.styles.scss";

const containerStyles = {
  width: "100%",
  height: "100vh",
};

const SkillTreeComponent = ({}) => {
  // State management
  const navigate = useNavigate();
  const { selectedClass } = useContext(ClassSelectionContext);
  const { skillTreeState, setSkillTreeState } = useContext(SkillTreeContext);
  const { pointsParam } = useParams();

  const [nodes, setNodes] = useState(null);
  const [links, setLinks] = useState(null);

  const treeContainerRef = useRef(null);
  const treeGroupRef = useRef(null);
  const [skillTreeData, setSkillTreeData] = useState(null);

  // Tooltip related states
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const [totalAllocatedPoints, setTotalAllocatedPoints] = useState(0);
  // const [nodeState, setNodeState] = useState();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Initialize the skill tree based on the URL parameter
  useEffect(() => {
    if (pointsParam && nodes) {
      const updatedNodes = parsePointsParam(pointsParam, nodes);
      setSkillTreeData(updatedNodes);
      console.log(updatedNodes);
    }
  }, [pointsParam, nodes]);

  // Handle class selection and load the proper skillTreeData
  useEffect(() => {
    if (!selectedClass) return;

    let classData;

    switch (selectedClass) {
      case "Barbarian":
        classData = barbarianData;
        break;
      case "Necromancer":
        classData = necromancerData;
        break;
      case "Sorcerer":
        classData = sorcererData;
        break;
      case "Rogue":
        classData = rogueData;
        break;
      case "Druid":
        classData = druidData;
        break;
      default:
        classData = null;
    }

    if (classData) {
      const updatedSkillTreeData = updateSkillTree(
        classData,
        pointsParam || "" // Provide a default value for pointsParam
      );
      setSkillTreeData(updatedSkillTreeData);
    }
  }, [selectedClass, pointsParam]);

  useEffect(() => {
    console.log(skillTreeData);
    if (!skillTreeData) return;

    const containerWidth = treeContainerRef.current.clientWidth;
    const containerHeight = treeContainerRef.current.clientHeight;
    const initialTransform = d3.zoomIdentity.translate(
      containerWidth / 2,
      containerHeight / 2
    );

    const svg = d3.select(treeContainerRef.current);
    svg.selectAll("*").remove();

    addLinkPatterns(svg);

    // Helper function to flatten the structure
    const flatten = (data) => {
      const nodes = [];
      const links = [];

      function traverse(node) {
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
    setNodes(nodes);
    setLinks(links);
    console.log("total nodes: ", nodes.length);
    console.log("nodes: ", nodes);

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

    // ========================================= DRAW LINKS
    let linkElements = drawLinksBetweenNodes(
      containerGroup,
      svg,
      links,
      totalAllocatedPoints
    );
    let activeLinkElements = drawActiveLinksBetweenNodes(
      containerGroup,
      svg,
      links,
      totalAllocatedPoints
    );

    // TODO need to extract this to a helper file
    // Update the links' image based on activation
    function updateLinksOnNodeAllocation() {
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
        (d) => `translate(${d.x * 5 - 1775}, ${d.y * 5 - 1045})`
      )
      // Set the default placement of the tree and zoom level at firstl load
      .call(zoom.transform, initialTransform);

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
      linkElements = updateLinkElements(containerGroup, links);

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

      // Update the URL with the allocated points
      const pointsParam = generatePointsParam(nodes);
      const newPath = `/skill-tree/${selectedClass}/${pointsParam}`;
      //navigate(newPath, { replace: true }); // TODO FIX THIS
      window.history.replaceState({}, "", newPath);
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
      // updateNodeHubLinkOnPointChange(
      //   updateNodeHubLinkColors,
      //   updatedTotalAllocatedPoints,
      //   node,
      //   nodes,
      //   updateLinkColor,
      //   linkElements
      // );

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

    // console.log("nodes: " + nodes);
    // setNodeState(nodes);
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
