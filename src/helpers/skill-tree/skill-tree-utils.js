import createSpellImagesMap from "../spell-images-loader/spell-images-map";

const classSpellImagesMaps = {};

function normalizeSpellName(name) {
  // Remove special characters, like apostrophes
  const noSpecialChars = name.replace(/[^\w\s]/gi, "");

  // Replace spaces with underscores and convert to lowercase
  const normalized = noSpecialChars.replace(/\s+/g, "_").toLowerCase();

  // Append the double underscore
  const withDoubleUnderscore = normalized + "__";

  return withDoubleUnderscore;
}

const loadSpellImagesMapForClass = (className) => {
  if (!className) return;

  const lowerCaseClassName = className.toLowerCase();

  if (!classSpellImagesMaps[lowerCaseClassName]) {
    classSpellImagesMaps[lowerCaseClassName] =
      createSpellImagesMap(lowerCaseClassName);
  }
};

export const getSpellImage = (node, className) => {
  if (!node || !className) return null;

  const nodeName = normalizeSpellName(node.name);

  if (
    node.nodeType === "activeSkillBuff" ||
    node.nodeType === "activeSkillUpgrade"
  ) {
    if (node.parent) {
      return getSpellImage(node.parent, className);
    }
  }

  // console.log("nodeName -> ", nodeName);
  // console.log(className, " spell images map loaded...");
  // console.log(classSpellImagesMaps);
  // Use the appropriate image map based on the class
  loadSpellImagesMapForClass(className);

  const lowerCaseClassName = className.toLowerCase();
  return classSpellImagesMaps[lowerCaseClassName][nodeName];
};

export const isNodeImageActive = (
  node,
  targetNode,
  isAllocate,
  isNodeActive
) => {
  const isActive = isNodeActive(node);
  if (isAllocate) {
    return isActive || targetNode.allocatedPoints >= 0;
  } else {
    return isActive && targetNode.allocatedPoints > 0;
  }
};

export const addLinkPatterns = (svg, linkImage, activeLinkImage) => {
  const pattern = svg
    .append("defs")
    .append("pattern")
    .attr("id", "linkImagePattern")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 260)
    .attr("height", 260)
    .attr("viewBox", "0 0 312 84")
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("patternTransform", "rotate(90)");

  // Add the base link image
  pattern
    .append("image")
    .attr("href", linkImage)
    .attr("width", 260)
    .attr("height", 260);

  // Add the active link image with the mask
  pattern
    .append("image")
    .attr("href", activeLinkImage)
    .attr("width", 260)
    .attr("height", 260)
    .attr("mask", "url(#linkImageMask)");
};

// Update the point counter on the nodeHubs
export const updateNodeHubsPointCounterAfterPointChange = (
  nodeGroup,
  updatedTotalAllocatedPoints
) => {
  nodeGroup.selectAll(".nodeHub-counter").text((d) => {
    if (d.nodeType !== "nodeHub") {
      return "";
    }
    return `${updatedTotalAllocatedPoints}/${d.requiredPoints}`;
  });
};

// Update the active-node class for parentNode's children nodes
export const updateParentNodesChildrenAfterPointChange = (
  nodes,
  parentNode,
  containerGroup,
  isAllocate
) => {
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
};

// Update the nodeHub's image
export const updateNodeHubImageAfterPointChange = (
  parentNode,
  nodeGroup,
  getNodeImage,
  isNodeActive
) => {
  if (parentNode && parentNode.nodeType === "nodeHub") {
    nodeGroup
      .filter((d) => d.name === parentNode.name)
      .select("image.skill-node-image")
      .attr(
        "href",
        getNodeImage(parentNode.nodeType, isNodeActive(parentNode))
      );
  }
};

// Activate direct children nodes if the allocated node is a non-nodeHub node
export const activateDirectChildrenAfterPointChange = (
  nodes,
  node,
  containerGroup
) => {
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
};

// Replace the frame image and add a classname if the node is active
export const updateNodeFrameOnPointChange = (
  nodeGroup,
  node,
  getNodeAttributes,
  getNodeImage,
  isNodeActive,
  targetNode,
  isAllocate
) => {
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
};

export const getLinkColor = (source, target, totalPoints) => {
  let linkIsActive = false;

  if (source.nodeType === "nodeHub" && target.nodeType === "nodeHub") {
    linkIsActive = totalPoints >= target.requiredPoints;
  } else {
    linkIsActive = target.allocatedPoints > 0;
  }

  return linkIsActive ? "#c7170b" : "#2a3031";
};

// Update node hub link colors
export const updateNodeHubLinkOnPointChange = (
  updateNodeHubLinkColors,
  updatedTotalAllocatedPoints,
  node,
  nodes,
  updateLinkColor,
  linkElements
) => {
  updateNodeHubLinkColors(updatedTotalAllocatedPoints, linkElements);
  // Update the link colors for all connected nodes
  node.connections.forEach((connection) => {
    const parentNode = nodes.find((n) => n.name === connection);
    if (parentNode) {
      updateLinkColor(parentNode, node, linkElements);
    }
  });
};

// Update the link color between the nodes
export const updateLinkColor = (source, target, linkElements) => {
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
};

// Fins the last nodeHub that has any children with points on it
function getLastActiveNodeHub(nodes) {
  let lastActiveNodeHub = null;

  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];

    if (node.allocatedPoints > 0) {
      for (let j = i - 1; j >= 0; j--) {
        const prevNode = nodes[j];

        if (prevNode.nodeType === "nodeHub") {
          lastActiveNodeHub = prevNode;
          break;
        }
      }
      break;
    }
  }

  return lastActiveNodeHub;
}

// Checks if the point removal would break the point requirements of the nodeHub from where we want to remove points
export const canRemovePoint = (node, nodes) => {
  if (node.allocatedPoints === 0) {
    return false;
  }

  let lastActiveNodeHub = getLastActiveNodeHub(nodes);

  const updatedNodes = nodes.map((n) => {
    if (n.id === node.id) {
      return {
        ...n,
        allocatedPoints: n.allocatedPoints - 1,
      };
    } else {
      return n;
    }
  });

  let allocatedPoints = 0;
  let foundNode = false;
  let parentNodeHub = null;

  for (let i = nodes.length - 1; i >= 0; i--) {
    const currentNode = nodes[i];

    if (currentNode.id === node.id) {
      foundNode = true;
      continue;
    }

    if (foundNode && currentNode.nodeType === "nodeHub") {
      parentNodeHub = currentNode;
      break;
    }
  }

  if (parentNodeHub === lastActiveNodeHub) {
    return true;
  }

  for (let i = 0; i < nodes.length; i++) {
    const currentNode = nodes[i];

    if (currentNode === lastActiveNodeHub) {
      break;
    }

    allocatedPoints += currentNode.allocatedPoints;
  }

  if (
    node.nodeType !== "nodeHub" &&
    lastActiveNodeHub &&
    allocatedPoints - 1 < lastActiveNodeHub.requiredPoints
  ) {
    return false;
  }

  return true;
};
