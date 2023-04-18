import React, { useRef, useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import * as d3 from "d3";
import { select, pointer } from "d3-selection";

//Contexts
import ClassSelectionContext from "../../contexts/class-selection.context.jsx";
import { SkillTreeContext } from "../../contexts/skill-tree-state-management.context.jsx";

// Components
import SkillNode from "../skill-node/skill-node.component.jsx";
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

  // Initialize the skill tree based on the URL parameter
  useEffect(() => {
    if (pointsParam && nodes) {
      const updatedNodes = parsePointsParam(pointsParam, nodes);
      setSkillTreeData(updatedNodes);
      console.log(updatedNodes);
    }
  }, [pointsParam, nodes]);

  // Initial skill tree data loading based on url params
  useEffect(() => {
    console.log("skillTreeData at param gen -> ", skillTreeData);
    if (skillTreeData) {
      const pointsParam = generatePointsParam(skillTreeData);
      navigate(`/skill-tree/${selectedClass}/${pointsParam}`, {
        replace: true,
      });
    }
  }, [skillTreeData, navigate, selectedClass]);

  // Update the URL with the allocated points
  useEffect(() => {
    console.log("nodes -> ", nodes);
    const pointsParam = generatePointsParam(nodes);
    const newPath = `/skill-tree/${selectedClass}/${pointsParam}`;
    window.history.replaceState({}, "", newPath);
  }, [nodes, selectedClass]);

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
      .append((node) => {
        const nodeElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        ReactDOM.render(
          <SkillNode
            node={node}
            nodes={nodes}
            selectedClass={selectedClass}
            getNodeAttributes={getNodeAttributes}
            getNodeImage={getNodeImage}
            isNodeActive={isNodeActive}
            // onPointAllocated={onPointAllocated}
            // onPointDeallocated={onPointDeallocated}
            containerGroup={containerGroup}
            links={links}
            updateLinksOnNodeAllocation={updateLinksOnNodeAllocation}
            totalAllocatedPoints={totalAllocatedPoints}
          />,
          nodeElement
        );
        return nodeElement;
      });

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

    // TODO
    // Update the point indicator on click
    // nodeGroup
    //   .on("click", (event, d) => {
    //     handleNodeClick(d);
    //     d3.select(event.currentTarget)
    //       .select(".point-indicator")
    //       .text((d) =>
    //         d.nodeType !== "nodeHub" && d.maxPoints > 1
    //           ? `${d.allocatedPoints}/${d.maxPoints}`
    //           : ""
    //       );
    //   })
    //   .on("contextmenu", (event, d) => {
    //     event.preventDefault(); // Prevent the browser context menu from showing up
    //     handleNodeRightClick(d);
    //     d3.select(event.currentTarget)
    //       .select(".point-indicator")
    //       .text((d) =>
    //         d.nodeType !== "nodeHub" && d.maxPoints > 1
    //           ? `${d.allocatedPoints}/${d.maxPoints}`
    //           : ""
    //       );
    //   });

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
      })
      .on("mouseleave", () => {
        setTooltipData(null);
        setTooltipPosition(null);
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

export default SkillTreeComponent;
