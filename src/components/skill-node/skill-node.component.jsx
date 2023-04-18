import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

import {
  getNodeAttributes,
  getSkillCategoryImage,
} from "../../helpers/skill-tree/get-node-attributes";
import {
  getSpellImage,
  updateNodeHubsPointCounterAfterPointChange,
  updateParentNodesChildrenAfterPointChange,
  updateNodeHubImageAfterPointChange,
  activateDirectChildrenAfterPointChange,
  updateNodeFrameOnPointChange,
} from "../../helpers/skill-tree/skill-tree-utils";

const SkillNode = ({
  node,
  nodes,
  selectedClass,
  getNodeAttributes,
  getNodeImage,
  onPointAllocated,
  onPointDeallocated,
  containerGroup,
  links,
  updateLinksOnNodeAllocation,
  totalAllocatedPoints,
}) => {
  const nodeRef = useRef();
  const [nodeSelection, setNodeSelection] = useState(null);

  const isNodeClickable = (node) => {
    if (node.nodeType === "nodeHub") {
      return false;
    }

    // Check if the node is disabled due to the last children logic
    if (node.nodeType === "activeSkillUpgrade" && node.disabled) {
      return false;
    }

    const parentNode = nodes.find((n) => node.connections.includes(n.name));
    const totalPoints = totalAllocatedPoints;

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
    // TODO //const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);

    // Update linkElements selection
    // TODO //linkElements = updateLinkElements(containerGroup, links);

    // Update link images
    updateLinksOnNodeAllocation(totalAllocatedPoints);

    // Replace the frame image and add a classname if the node is active
    updateNodeFrameOnPointChange(
      nodeSelection,
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
      nodeSelection,
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
      nodeSelection,
      totalAllocatedPoints
    );

    // Update the URL with the allocated points
    // const pointsParam = generatePointsParam(nodes);
    // const newPath = `/skill-tree/${selectedClass}/${pointsParam}`;
    // //navigate(newPath, { replace: true }); // TODO FIX THIS
    // window.history.replaceState({}, "", newPath);
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

    // Update link images
    updateLinksOnNodeAllocation(totalAllocatedPoints);

    // Replace the frame image and add a classname if the node is active
    updateNodeFrameOnPointChange(
      nodeSelection,
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
      nodeSelection,
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
      nodeSelection,
      totalAllocatedPoints
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
    d3.select(`g.node[data-name='${node.name}']`).classed(
      "allocated-node",
      true
    );
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
    else if (!hasAllocatedPointsInChildren(node) && node.allocatedPoints > 0) {
      onPointDeallocated(node);
    }

    // Remove additional class name from the nodes
    d3.select(`g.node[data-name='${node.name}']`).classed(
      "allocated-node",
      false
    );
  };

  const isNodeActive = (node, nodes, allocatedPoints = null) => {
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

  useEffect(() => {
    const d = node;
    const nodeSelection = d3.select(nodeRef.current);

    // Apply the skill frame images to the nodes
    nodeSelection
      .append("image")
      .attr("class", "skill-node-image")
      .attr("href", () => getNodeAttributes(d.nodeType).image)
      .attr("width", () => getNodeAttributes(d.nodeType).frameWidth)
      .attr("height", () => getNodeAttributes(d.nodeType).frameHeight)
      .attr("transform", () => {
        const { frameTranslateX: translateX, frameTranslateY: translateY } =
          getNodeAttributes(d.nodeType);
        return `translate(${translateX}, ${translateY})`;
      });

    // Apply the nodeHub skill category images to the nodes
    if (d.nodeType === "nodeHub") {
      nodeSelection
        .append("image")
        .attr("class", "skill-category-image")
        .attr("href", () => getSkillCategoryImage(d).image)
        .attr(
          "width",
          () => getNodeAttributes(d.nodeType).skillCategoryImageWidth
        )
        .attr(
          "height",
          () => getNodeAttributes(d.nodeType).skillCategoryImageHeight
        )
        .attr("transform", () => {
          const {
            skillCategoryTranslateX: translateX,
            skillCategoryTranslateY: translateY,
          } = getNodeAttributes(d.nodeType);
          return `translate(${translateX}, ${translateY})`;
        });
    }

    // Apply the spell images to the nodes
    nodeSelection
      .append("image")
      .attr("class", "spell-node-image")
      .attr("href", () => getSpellImage(d, selectedClass))
      .attr("width", () => getNodeAttributes(d.nodeType).spellWidth)
      .attr("height", () => getNodeAttributes(d.nodeType).spellHeight)
      .attr("transform", () => {
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
    nodeSelection
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "3.2rem")
      .attr("class", "node-text")
      .text(() => d.name);

    // Add the points indicator to the nodes
    nodeSelection
      .append("text")
      .attr("class", "point-indicator")
      .attr("text-anchor", "middle")
      .attr("y", () => getNodeAttributes(d.nodeType).frameHeight / 4 - 10)
      .text(() =>
        d.nodeType !== "nodeHub" && d.maxPoints > 1
          ? `${d.allocatedPoints}/${d.maxPoints}`
          : ""
      );

    // Update the point indicator on click
    nodeSelection
      .on("click", (event) => {
        event.stopPropagation();
        handleNodeClick(d);
        nodeSelection
          .select(".point-indicator")
          .text(() =>
            d.nodeType !== "nodeHub" && d.maxPoints > 1
              ? `${d.allocatedPoints}/${d.maxPoints}`
              : ""
          );
      })
      .on("contextmenu", (event) => {
        event.preventDefault(); // Prevent the browser context menu from showing up
        handleNodeRightClick(d);
        nodeSelection
          .select(".point-indicator")
          .text(() =>
            d.nodeType !== "nodeHub" && d.maxPoints > 1
              ? `${d.allocatedPoints}/${d.maxPoints}`
              : ""
          );
      });

    setNodeSelection(nodeSelection);

    // Disable double-click zoom on nodes
    d3.select(nodeRef.current).on("dblclick", (event) => {
      event.stopPropagation();
    });
  }, [node, selectedClass, handleNodeClick, handleNodeRightClick]);

  return (
    <g
      ref={nodeRef}
      className={`${getNodeAttributes(node.nodeType).class} ${
        node.nodeType !== "nodeHub" && isNodeActive(node, nodes)
          ? "active-node"
          : ""
      }`}
      transform={`translate(${node.x * 5 - 1775}, ${node.y * 5 - 1045})`}
    />
  );
};

export default SkillNode;
