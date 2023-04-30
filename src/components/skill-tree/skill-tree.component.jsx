import React, { useRef, useEffect, useState, useContext } from "react";
import * as d3 from "d3";
import { select, pointer } from "d3-selection";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";

// Components
import Navbar from "../navbar-top/navbar-top.component.jsx";
import Footer from "../footer/footer.component.jsx";
import SkillTooltipComponent from "../skill-tooltip/skill-tooltip.component.jsx";
import SearchComponent from "../search/search.component.jsx";
import SearchHelpComponent from "../search-help/search-help.component";

// Helper Functions
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
  canRemovePoint,
  updateLinks,
  drawLinksBetweenNodes,
  drawActiveNodeHubLinkImage,
  removeActiveNodeHubLinkImage,
  drawActiveLinkImage,
  removeActiveLinkImage,
  drawHighlightedLinkImage,
  removeHighlightedLinkImage,
  addHoverFrame,
  removeHoverFrame,
  animateSkillNodeImage,
  addGlowEffect,
  addFlashEffect,
  resetNodes,
  addCustomLink,
} from "../../helpers/skill-tree/skill-tree-utils.js";
import { getNodeImage } from "../../helpers/skill-tree/get-node-attributes.js";
import { updatePointIndicator } from "../../helpers/skill-tree/d3-tree-update.js";
import { canDeallocateClassSpecificNode } from "../../helpers/skill-tree/special-node-deallocation.js";
import { handleSearch } from "../../helpers/skill-tree/search-utils.js";

import barbarianData from "../../data/barbarian.json";
import necromancerData from "../../data/necromancer.json";
import sorcererData from "../../data/sorcerer.json";
import rogueData from "../../data/rogue.json";
import druidData from "../../data/druid.json";

import "./skill-tree.styles.scss";

// Images

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
  const { selectedClass } = useContext(ClassSelectionContext);
  const skillTreeRef = useRef(null);
  const navbarRef = useRef(null);
  const footerRef = useRef(null);

  const treeContainerRef = useRef(null);
  const treeGroupRef = useRef(null);
  const [skillTreeData, setSkillTreeData] = useState(null);

  // Tooltip related states
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const [totalAllocatedPoints, setTotalAllocatedPoints] = useState(0);
  const [nodes, setNodes] = useState();
  const [links, setLinks] = useState();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Search
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());

  // Handle class selection
  useEffect(() => {
    if (!selectedClass) return;

    switch (selectedClass) {
      case "Barbarian":
        setSkillTreeData(barbarianData);
        break;
      case "Necromancer":
        setSkillTreeData(necromancerData);
        break;
      case "Sorcerer":
        setSkillTreeData(sorcererData);
        break;
      case "Rogue":
        setSkillTreeData(rogueData);
        break;
      case "Druid":
        setSkillTreeData(druidData);
        break;
      default:
        setSkillTreeData(null);
    }
  }, [selectedClass]);

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

    addLinkPatterns(svg);

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
      let nodesWithMultipleParents = nodes.filter(
        (node, index, self) =>
          index === self.findIndex((n) => n.name === node.name)
      );

      // Remove the first elements
      nodesWithMultipleParents.shift();
      links.shift();

      return {
        nodes: nodesWithMultipleParents,
        links: [...links],
      };
    };

    // Extract nodes and links directly from the skillTreeData object
    const { nodes, links } = flatten(skillTreeData);
    // Add some special links between nodes without direct connection in data
    if (selectedClass === "Necromancer") {
      addCustomLink("Gruesome Mending", "Coalesced Blood", nodes, links);
    }
    if (selectedClass === "Druid") {
      addCustomLink("Charged Atmosphere", "Bad Omen", nodes, links);
    }

    console.log("nodes -> ", nodes);
    console.log("total nodes: " + nodes.length);
    setNodes(nodes);
    setLinks(links);

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
    treeGroupRef.current = containerGroup;
    // Fix the first zoom & drag incorrect behavior with applying the initial transform values
    svg.call(zoom.transform, initialTransform);

    // ========================================= DRAW LINKS
    let linkElements = drawLinksBetweenNodes(svg, containerGroup, links);
    const totalPoints = calculateTotalAllocatedPoints(nodes);

    let initialLoad = true;
    let node = null;
    drawHighlightedLinkImage(
      svg,
      containerGroup,
      nodes,
      links,
      totalPoints,
      initialLoad,
      node
    );

    // Check if a node can be clicked
    const isNodeActive = (node, allocatedPoints = null) => {
      if (node.nodeType === "nodeHub") {
        return true;
      }

      if (node.specialNode && node.allocatedPoints > 0) {
        return true;
      }

      if (node.nodeType === "passiveSkill" && node.allocatedPoints > 0) {
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
      .attr("id", (d) => d.id)
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
        handleNodeClick(event, d);

        d3.select(event.currentTarget)
          .select(".point-indicator")
          .text((d) =>
            d.nodeType !== "nodeHub" && d.maxPoints > 1
              ? `${d.allocatedPoints}/${d.maxPoints}`
              : ""
          );
      })

      // Update the point indicator on right-click
      .on("contextmenu", (event, d) => {
        event.preventDefault(); // Prevent the browser context menu from showing up
        handleNodeRightClick(d);

        updatePointIndicator(
          d.name,
          d.allocatedPoints,
          d.maxPoints,
          d.nodeType,
          treeContainerRef
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

    const shouldNodeAllowPointChange = (
      node,
      nodes,
      totalPoints,
      isAllocate
    ) => {
      const connectedNodes = nodes.filter((n) =>
        node.connections.includes(n.name)
      );
      // console.log("connectedNodes -> ", connectedNodes);
      // console.log("isAllocate -> ", isAllocate);

      const activeNodeHubInConnections = connectedNodes.some(
        (connectedNode) =>
          connectedNode.nodeType === "nodeHub" &&
          totalPoints >= connectedNode.requiredPoints
      );

      const allocatedNodesInConnections = connectedNodes.some(
        (connectedNode) => connectedNode.allocatedPoints > 0
      );

      if (isAllocate && activeNodeHubInConnections) {
        return true;
      } else if (isAllocate && allocatedNodesInConnections) {
        return true;
      } else if (!isAllocate && node.allocatedPoints > 0) {
        return true;
      } else {
        return false;
      }
    };

    const isNodeClickable = (node, nodes, isAllocate) => {
      if (node.nodeType === "nodeHub") {
        return false;
      }
      const totalPoints = calculateTotalAllocatedPoints(nodes);

      if (shouldNodeAllowPointChange(node, nodes, totalPoints, isAllocate)) {
        return true;
      }
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
      // linkElements = updateLinkElements(containerGroup, links);
      // console.log("linkElements -> ", linkElements);

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

      // Find the link between the parentNode and the allocated node
      const allocatedLink = links.find(
        (link) =>
          link.source.name === parentNode.name && link.target.name === node.name
      );
      console.log("allocatedLink -> ", allocatedLink);

      // Draw active link images between the allocated node and its parent
      drawActiveLinkImage(
        svg,
        containerGroup,
        allocatedLink,
        nodes.indexOf(node),
        node,
        parentNode,
        nodeGroup
      );

      // Update links array
      const updatedLinks = updateLinks(nodes);
      //console.log("updatedLinks -> ", updatedLinks);

      removeHighlightedLinkImage(containerGroup, {
        source: node.parent,
        target: node,
      });

      initialLoad = false;
      // Draw highlighted link image
      drawHighlightedLinkImage(
        svg,
        containerGroup,
        nodes, // TODO <- here
        updatedLinks,
        updatedTotalAllocatedPoints,
        initialLoad,
        node
      );

      // Draw the active nodeHub links in progress
      drawActiveNodeHubLinkImage(
        svg,
        containerGroup,
        nodeGroup,
        nodes,
        updatedTotalAllocatedPoints
      );

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

      setNodes(nodes);
      setLinks(updatedLinks);
    }

    function onPointDeallocated(node) {
      // Prevent removing points from a node with 0 points allocated
      if (node.allocatedPoints === 0) {
        return;
      }
      const canRemove = canRemovePoint(node, nodes);

      if (!canRemove) {
        return;
      }

      const isAllocate = false;
      console.log("Deallocated node:", node);

      // Find the node in the nodes array
      const targetNode = nodes.find((n) => n.name === node.name);

      console.log("the node right before the removal ->> ", node);
      // Deallocate the point
      targetNode.allocatedPoints -= 1;

      // Update the total points spent counter
      const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);

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

      const updatedLinks = updateLinks(nodes);
      // console.log("updatedLinks -> ", updatedLinks);

      // Activate direct children nodes if the allocated node is a non-nodeHub node
      activateDirectChildrenAfterPointChange(nodes, node, containerGroup);

      // Find the parentNode (nodeHub) of the allocated node
      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      // TODO need to check if there are points left on the node  to remove
      // Remove the active link images
      if (node.allocatedPoints < 1) {
        removeActiveLinkImage(node, parentNode, containerGroup, svg, links);
      }

      removeActiveNodeHubLinkImage(
        svg,
        containerGroup,
        nodeGroup,
        nodes,
        updatedTotalAllocatedPoints
      );

      removeHighlightedLinkImage(containerGroup, {
        source: node.parent,
        target: node,
      });

      initialLoad = false;
      // Draw highlighted link image
      drawHighlightedLinkImage(
        svg,
        containerGroup,
        nodes, // TODO <- here
        updatedLinks,
        updatedTotalAllocatedPoints,
        initialLoad,
        node
      );

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

      // Remove additional class name from the nodes
      nodeGroup
        .filter((d) => d.name === node.name)
        .classed("allocated-node", false);

      setNodes(nodes);
      setLinks(updatedLinks);
    }

    // Handle the click on a node (point allocation)
    const handleNodeClick = (event, node) => {
      console.log("node's children on click -> ", node.children);
      console.log("node's connections on click -> ", node.connections);
      if (!isNodeClickable(node, nodes, true /* allocate */)) {
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

      // Animate the node frame on click
      animateSkillNodeImage(d3.select(event.currentTarget), node);
      addGlowEffect(d3.select(event.currentTarget), node);
      addFlashEffect(d3.select(event.currentTarget), node);

      // Add additional class name to the nodes
      nodeGroup
        .filter((d) => d.name === node.name)
        .classed("allocated-node", true);
    };

    // Handle the right-click on a node (point deallocation)
    const handleNodeRightClick = (node) => {
      if (!isNodeClickable(node, nodes, false /* deallocate */)) {
        return;
      }

      const getParentNode = (currentNode, allNodes) => {
        const connectedNodes = allNodes.filter((n) =>
          currentNode.connections.includes(n.name)
        );
        let childrenNames = "";
        childrenNames = currentNode.children
          ? currentNode.children.map((child) => child.name)
          : [];

        const parentNodeName = currentNode.connections.find(
          (connectionName) => !childrenNames.includes(connectionName)
        );

        return allNodes.find((node) => node.name === parentNodeName);
      };
      const parentNode = getParentNode(node, nodes);

      // Handle special nodes by class
      if (node.specialNode) {
        if (canDeallocateClassSpecificNode(node, nodes, selectedClass)) {
          onPointDeallocated(node);
          return;
        } else {
          return;
        }
      }

      const getDirectChildren = (actualNode) => {
        return nodes.filter(
          (childNode) =>
            actualNode.children &&
            actualNode.children.find((child) => child.name === childNode.name)
        );
      };

      const hasAllocatedPointsInChildren = (actualNode) => {
        const children = actualNode.children
          ? getDirectChildren(actualNode)
          : [];
        return children.some((child) => child.allocatedPoints > 0);
      };

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
      if (node.allocatedPoints - 1 > 0 && hasAllocatedPointsInChildren(node)) {
        onPointDeallocated(node);
      }
      // Check if the node has no children with allocated points
      else if (
        !hasAllocatedPointsInChildren(node) &&
        node.allocatedPoints > 0
      ) {
        onPointDeallocated(node);
      }
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
        setTooltipPosition({ x: event.pageX, y: event.pageY });
        setTooltipVisible(true);
        addHoverFrame(nodeGroup, d);
      })
      .on("mouseleave", (event, d) => {
        setTooltipData(null);
        setTooltipPosition(null);
        setTooltipVisible(false);
        removeHoverFrame(nodeGroup, d);
      });
  }, [skillTreeData]);

  return (
    <div className="skill-tree" style={containerStyles}>
      <Navbar
        nodes={nodes}
        links={links}
        svg={d3.select(treeContainerRef.current)}
        nodeGroup={d3.select(treeContainerRef.current).select(".nodes-group")}
      />
      <SearchComponent
        onSearch={handleSearch(nodes, treeGroupRef, setHighlightedNodes)}
      />
      <SearchHelpComponent />
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
