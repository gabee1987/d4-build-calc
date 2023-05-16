import React, { useRef, useEffect, useState, useContext } from "react";
import * as d3 from "d3";
import { drag } from "d3-drag";
import { select } from "d3-selection";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";
import PointsContext from "./points.context.jsx";

// Components
import Navbar from "../navbar-top/navbar-top.component.jsx";
import SkillTooltipComponent from "../skill-tooltip/skill-tooltip.component.jsx";
import ClassInfo from "../class-info/class-info.component.jsx";
import SearchHelpComponent from "../search-help/search-help.component";

import PointIndicatorPanel from "../point-panel/point-panel.component";

// Helper Functions
import {
  getNodeAttributes,
  getSkillCategoryImage,
} from "../../helpers/skill-tree/get-node-attributes.js";
import {
  getSpellImage,
  addLinkPatterns,
  updateParentNodesChildrenAfterPointChange,
  updateNodeHubImageAndPointIndicator,
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
  updateHighlightedNodeFrames,
  removeHighlightedLinkImage,
  addHighlightFrame,
  removeHighlightFrame,
  animateSkillNodeImage,
  addGlowEffect,
  addCircleEffect,
  addFlashEffect,
  addCustomLink,
  renderXSignOnHover,
  getParentNode,
  addTempPointIndicator,
  removeTempPointIndicator,
  calculateTotalAllocatedPoints,
  shouldNodeAllowPointChange,
  isNodeClickable,
} from "../../helpers/skill-tree/skill-tree-utils.js";
import { getNodeImage } from "../../helpers/skill-tree/get-node-attributes.js";
import { updatePointIndicator } from "../../helpers/skill-tree/d3-tree-update.js";
import { canDeallocateClassSpecificNode } from "../../helpers/skill-tree/special-node-deallocation.js";
import { handleSearch } from "../../helpers/skill-tree/search-utils.js";
import {
  generateURLWithAllocatedPoints,
  parseAllocatedPointsFromURL,
} from "../../helpers/skill-tree/tree-share-utils.js";

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
  const [actualURL, setActualURL] = useState("");

  const treeContainerRef = useRef(null);
  const treeGroupRef = useRef(null);
  const [skillTreeData, setSkillTreeData] = useState(null);
  const [resetStatus, setResetStatus] = useState(false);

  // Tooltip related states
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const [totalAllocatedPoints, setTotalAllocatedPoints] = useState(0);
  const [nodes, setNodes] = useState();
  const [links, setLinks] = useState();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Search
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());

  // Class info panel
  const [isClassInfoOpen, setIsClassInfoOpen] = useState(false);
  const toggleClassInfo = () => {
    setIsClassInfoOpen(!isClassInfoOpen);
  };

  // Search Help panel
  const [isSearchInfoOpen, setIsSearchInfoOpen] = useState(false);
  const toggleSearchInfo = () => {
    setIsSearchInfoOpen(!isSearchInfoOpen);
  };

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
    if (!Array.isArray(nodes) || nodes.length === 0) {
      return;
    }
    const newPoints = calculateTotalAllocatedPoints(nodes);
    setTotalAllocatedPoints(newPoints);
  }, [totalAllocatedPoints]);

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
        nodes.push({
          ...node,
          allocatedPoints: node.allocatedPoints || 0,
          isActivated: node.nodeType === "nodeHub" ? false : undefined,
        });

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
      addCustomLink("Ultimate", "Inspiring Leader", nodes, links);
    }
    if (selectedClass === "Druid") {
      addCustomLink("Charged Atmosphere", "Bad Omen", nodes, links);
    }

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
    svg.call(zoom).on("dblclick.zoom", null);

    // Create a container group element
    const containerGroup = svg.append("g").attr("class", "svg-container");
    treeGroupRef.current = containerGroup;
    // Fix the first zoom & drag incorrect behavior with applying the initial transform values
    svg.call(zoom.transform, initialTransform);

    // ========================================= DRAW LINKS
    let linkElements = drawLinksBetweenNodes(svg, containerGroup, links);
    //const totalPoints = calculateTotalAllocatedPoints(nodes);
    //setTotalAllocatedPoints(totalPoints);

    let initialLoad = true;
    let node = null;
    drawHighlightedLinkImage(
      svg,
      containerGroup,
      nodes,
      links,
      totalAllocatedPoints,
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

      if (node.isUltimate) {
        const otherUltimateNodes = nodes.filter(
          (n) => n.isUltimate && n.name !== node.name
        );
        const otherAllocatedUltimateNode = otherUltimateNodes.find(
          (n) => n.allocatedPoints > 0
        );
        return !otherAllocatedUltimateNode;
      }

      if (node.allocatedPoints > 0) {
        return true;
      }

      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      if (parentNode === null) {
        return false;
      }

      return (
        isNodeActive(parentNode) &&
        parentNode.nodeType === "nodeHub" &&
        parentNode.allocatedPoints >= parentNode.requiredPoints
      );
    };

    // Define a drag event handler
    function onDrag(event) {
      event.sourceEvent.preventDefault();
    }
    // Create a drag behavior instance with the drag event handler
    const dragBehavior = drag().on("drag", onDrag);

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
      .call(zoom.transform, initialTransform)
      // Disable dragging on nodes
      .call(dragBehavior);

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
    updateNodeHubImageAndPointIndicator(nodes, totalAllocatedPoints, nodeGroup);

    // Apply the active nodeHub image on the first nodeHub
    nodeGroup
      .filter((d) => d.nodeType === "nodeHub" && d.name === "Basic")
      .select("image.skill-node-image")
      .attr("href", (d) => getNodeImage(d.nodeType, true));

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
      })
      .append("desc")
      .text((d) => `${d.name} spell image`);

    // Add the skill name text to the nodes
    // nodeGroup
    //   .append("text")
    //   .attr("text-anchor", "middle")
    //   .attr("dy", "3.2rem")
    //   .attr("class", "node-text")
    //   .text((d) => d.name);

    // Update the frames of the highlighted nodes
    //updateHighlightedNodeFrames(containerGroup);

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
        d.nodeType !== "nodeHub" && d.maxPoints > 1 && d.allocatedPoints > 0
          ? `${d.allocatedPoints}/${d.maxPoints}`
          : ""
      );

    // ========================================= NODE CLICK
    // Update the point indicator on click
    nodeGroup
      .on("click", (event, d) => {
        handleNodeClick(event, d);

        updatePointIndicator(
          d.name,
          d.allocatedPoints,
          d.maxPoints,
          d.nodeType,
          treeContainerRef
        );
      })

      // Update the point indicator on right-click
      .on("contextmenu", (event, d) => {
        event.preventDefault(); // Prevent the browser context menu from showing up
        handleNodeRightClick(event, d);

        updatePointIndicator(
          d.name,
          d.allocatedPoints,
          d.maxPoints,
          d.nodeType,
          treeContainerRef
        );
      });

    // Add event listener for reset event
    nodeGroup.on("reset", function (event, d) {
      nodes.forEach((node) => {
        node.allocatedPoints = 0;
      });

      //const totalPoints = calculateTotalAllocatedPoints(nodes);
      //setTotalAllocatedPoints(totalPoints);

      updateNodeFrameOnPointChange(
        nodeGroup,
        d,
        getNodeAttributes,
        getNodeImage,
        isNodeActive,
        d,
        false
      );
    });

    function onPointAllocated(node, loadFromUrl) {
      const isAllocate = true;

      // Find the node in the nodes array
      const targetNode = nodes.find((n) => n.name === node.name);

      // Allocate the point only if doesnt load from url
      if (!loadFromUrl) {
        targetNode.allocatedPoints += 1;
      }

      // Update the total points spent counter
      const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);
      setTotalAllocatedPoints(updatedTotalAllocatedPoints);

      // Activate direct children nodes if the allocated node is a non-nodeHub node
      activateDirectChildrenAfterPointChange(nodes, node, containerGroup);

      // Find the parentNode (nodeHub) of the allocated node
      const parentNode = nodes.find((n) => node.connections.includes(n.name));

      // Find the link between the parentNode and the allocated node
      const allocatedLink = links.find(
        (link) =>
          link.source.name === parentNode.name && link.target.name === node.name
      );

      // Draw active link images between the allocated node and its parent
      drawActiveLinkImage(
        svg,
        containerGroup,
        allocatedLink,
        nodes.indexOf(node),
        node,
        parentNode,
        nodeGroup,
        loadFromUrl
      );

      // Update links array
      const updatedLinks = updateLinks(nodes);
      //console.log("updatedLinks -> ", updatedLinks);

      removeHighlightedLinkImage(
        containerGroup,
        node,
        updatedTotalAllocatedPoints
      );

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

      // Update the frames of the highlighted nodes
      //updateHighlightedNodeFrames(containerGroup);

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

      // Draw the active nodeHub links in progress
      drawActiveNodeHubLinkImage(
        svg,
        containerGroup,
        nodes,
        updatedTotalAllocatedPoints,
        false // dont load from url
      );

      // Update the nodeHub's image
      updateNodeHubImageAndPointIndicator(
        nodes,
        updatedTotalAllocatedPoints,
        nodeGroup
      );

      // Update the active-node class for parentNode's children nodes
      updateParentNodesChildrenAfterPointChange(
        nodes,
        parentNode,
        containerGroup,
        isAllocate
      );

      // Generate the url with allocated points
      const newURL = generateURLWithAllocatedPoints(nodes, selectedClass);
      window.history.replaceState(null, null, newURL);

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

      // Find the node in the nodes array
      const targetNode = nodes.find((n) => n.name === node.name);

      // Deallocate the point
      targetNode.allocatedPoints -= 1;

      // Update the total points spent counter
      const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);
      setTotalAllocatedPoints(updatedTotalAllocatedPoints);

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

      removeActiveNodeHubLinkImage(containerGroup, updatedTotalAllocatedPoints);

      removeHighlightedLinkImage(
        containerGroup,
        node,
        updatedTotalAllocatedPoints
      );

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

      // Update the frames of the highlighted nodes
      //updateHighlightedNodeFrames(containerGroup);

      // Update the nodeHub's image
      updateNodeHubImageAndPointIndicator(
        nodes,
        updatedTotalAllocatedPoints,
        nodeGroup
      );

      // Update the active-node class for parentNode's children nodes
      updateParentNodesChildrenAfterPointChange(
        nodes,
        parentNode,
        containerGroup,
        isAllocate
      );

      // Remove additional class name from the nodes
      nodeGroup
        .filter((d) => d.name === node.name)
        .classed("allocated-node", false);

      // Generate the url with allocated points
      const newURL = generateURLWithAllocatedPoints(nodes, selectedClass);
      window.history.replaceState(null, null, newURL);

      setNodes(nodes);
      setLinks(updatedLinks);
    }

    // Handle the click on a node (point allocation)
    const handleNodeClick = (event, node) => {
      if (!isNodeClickable(node, nodes, true /* allocate */)) {
        return;
      }

      // Remove the hover point indicator
      removeTempPointIndicator(event, node);

      // Check if the node is a last child and the other last child has points allocated
      const lastChildren = nodes.filter(
        (n) =>
          n.baseSkill === node.baseSkill && n.nodeType === "activeSkillUpgrade"
      );

      if (lastChildren.length === 2) {
        const otherLastChild = lastChildren.find((n) => n.name !== node.name);
        const ultimateParent = getParentNode(otherLastChild, nodes);

        if (
          otherLastChild &&
          otherLastChild.allocatedPoints > 0 &&
          ultimateParent &&
          !ultimateParent.isUltimate
        ) {
          return;
        }
      }

      if (node.allocatedPoints < node.maxPoints) {
        onPointAllocated(node, false);
      } else {
        return;
      }

      // Animate the node frame on click
      if (node.allocatedPoints < 2) {
        addFlashEffect(d3.select(event.currentTarget), node);
        animateSkillNodeImage(d3.select(event.currentTarget), node);
        addGlowEffect(d3.select(event.currentTarget), node);
        addCircleEffect(d3.select(event.currentTarget), node);
      }

      // Add additional class name to the nodes
      nodeGroup
        .filter((d) => d.name === node.name)
        .classed("allocated-node", true);
    };

    // Handle the right-click on a node (point deallocation)
    const handleNodeRightClick = (event, node) => {
      if (!isNodeClickable(node, nodes, false /* deallocate */)) {
        return;
      }

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

      // Add the hover point indicator
      addTempPointIndicator(event, node);
    };

    // ========================================= TOOLTIP
    nodeGroup
      .on("mouseenter", (event, d) => {
        setTooltipData(d);
        setTooltipPosition({ x: event.pageX, y: event.pageY });
        setTooltipVisible(true);
        addHighlightFrame(nodeGroup, d, "hover-frame");
        renderXSignOnHover(nodes, nodeGroup, d);
        addTempPointIndicator(event, d);
      })
      .on("mouseleave", (event, d) => {
        setTooltipData(null);
        setTooltipPosition(null);
        setTooltipVisible(false);
        removeHighlightFrame(nodeGroup, d, "hover-frame");
        renderXSignOnHover(nodes, nodeGroup, null);
        removeTempPointIndicator(event, d);
      });

    // Check if there's a special URL with allocated points
    let initialAllocatedPoints = parseAllocatedPointsFromURL(selectedClass);
    let totalinitialPoints = null;

    if (
      initialAllocatedPoints &&
      (totalinitialPoints === null || initialAllocatedPoints.length > 0)
    ) {
      totalinitialPoints = initialAllocatedPoints.reduce((total, pointObj) => {
        return total + pointObj.value;
      }, 0);
    }

    if (initialAllocatedPoints) {
      initialAllocatedPoints.forEach((point) => {
        const node = nodes.find((n) => n.id === point.id);
        if (node) {
          for (let i = 0; i < point.value; i++) {
            node.allocatedPoints++;
            onPointAllocated(node, true /*loads from url*/);
            updatePointIndicator(
              node.name,
              node.allocatedPoints,
              node.maxPoints,
              node.nodeType,
              treeContainerRef
            );
          }
        }
      });

      // Update the total points spent counter
      const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);
      setTotalAllocatedPoints(updatedTotalAllocatedPoints);

      setNodes(nodes);
      initialAllocatedPoints = null;
    }
  }, [skillTreeData, resetStatus]);

  // RESET the tree
  useEffect(() => {
    if (resetStatus) {
      setResetStatus(false);
      setTotalAllocatedPoints(0);

      const className = window.location.pathname.split("/")[2];
      const newURL = `${window.location.origin}/skill-tree/${className}`;
      window.history.replaceState(null, null, newURL);
    }
  }, [resetStatus]);

  return (
    <PointsContext.Provider
      value={{
        allocatedPoints: totalAllocatedPoints,
        remainingPoints: 60 - totalAllocatedPoints,
        updatePoints: setTotalAllocatedPoints,
      }}
    >
      <div className="skill-tree" style={containerStyles}>
        <Navbar
          nodes={nodes}
          links={links}
          svg={d3.select(treeContainerRef.current)}
          nodeGroup={d3.select(treeContainerRef.current).select(".nodes-group")}
          setResetStatus={setResetStatus}
          toggleClassInfo={toggleClassInfo}
          toggleSearchInfo={toggleSearchInfo}
          handleSearch={handleSearch}
          treeGroupRef={treeGroupRef}
          setHighlightedNodes={setHighlightedNodes}
        />
        <PointIndicatorPanel />
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
        <ClassInfo
          selectedClass={selectedClass}
          className="class-info"
          isOpen={isClassInfoOpen}
          toggleClassInfo={toggleClassInfo}
        />
        <SearchHelpComponent
          className="search-help"
          isOpen={isSearchInfoOpen}
          toggleSearchInfo={toggleSearchInfo}
        />
      </div>
    </PointsContext.Provider>
  );
};

export default SkillTreeComponent;
