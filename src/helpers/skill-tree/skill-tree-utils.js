import { easeCubicOut, easeBounceOut, easeCircleIn } from "d3-ease";

import { getLinkAttributes } from "./get-link-attributes";
import { getNodeAttributes } from "./get-node-attributes";

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

// Checks if the point removal would break the point requirements of the last active nodeHub
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

// =================================================== LINK DRAWING
export const addLinkPatterns = (svg) => {
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
  // pattern
  //   .append("image")
  //   .attr("href", nodeLinkImage)
  //   .attr("width", 260)
  //   .attr("height", 260);

  // Add the active link image with the mask
  // pattern
  //   .append("image")
  //   .attr("href", nodeLinkImage_active)
  //   .attr("width", 260)
  //   .attr("height", 260)
  //   .attr("mask", "url(#linkImageMask)");
};

export const drawLinksBetweenNodes = (svg, containerGroup, links) => {
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
        .attr("width", linkWidth)
        .attr("height", linkHeight);
      return `url(#${id})` || "none";
    });

  return containerGroup.selectAll("path").data(links);
};

export const drawActiveLinksBetweenNodes = (svg, containerGroup, links) => {
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
      (d) => getLinkAttributes(d.source, d.target).linkWidth
    )
    .attr("fill", "none")
    .attr("stroke", (d, i) => {
      const sourceX = d.source.x * 5 - 1775;
      const sourceY = d.source.y * 5 - 1045;
      const targetX = d.target.x * 5 - 1775;
      const targetY = d.target.y * 5 - 1045;

      const linkType = getLinkAttributes(d.source, d.target).type;

      // Custom images for the links
      const linkWidth = getLinkAttributes(d.source, d.target).linkWidth_active;
      const linkHeight = getLinkAttributes(
        d.source,
        d.target
      ).linkHeight_active;
      const linkImage = getLinkAttributes(d.source, d.target).image_active;

      const angle =
        (Math.atan2(targetY - sourceY, targetX - sourceX) * 180) / Math.PI;
      const id = `activeLinkImagePattern${i}`;

      // Calculate the link's center point
      let centerX = 0;
      let centerY = 0;
      if (linkType === "hubLink") {
        centerX = sourceX + (targetX - sourceX) / 2;
        centerY = sourceY + (targetY - sourceY) / 2;
      } else {
        centerX = sourceX + (targetX - sourceX) / 2;
        centerY = sourceY + (targetY - sourceY) / 2;
      }

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
};

export const updateLinkElements = (containerGroup, links) => {
  return containerGroup.selectAll("path").data(links);
};

// ========================================= HOVER  EFFECTS
export const addHoverFrame = (nodeGroup, d) => {
  const currentNodeGroup = nodeGroup.filter((n) => n.name === d.name);
  const skillNodeImage = currentNodeGroup.select(".skill-node-image");
  nodeGroup
    .filter((n) => n.name === d.name)
    .insert("image", (d) => {
      return skillNodeImage.node().nextSibling;
    })
    .attr("class", "hover-frame")
    .attr("href", (d) => getNodeAttributes(d.nodeType).hoverFrameImage)
    .attr("width", (d) => getNodeAttributes(d.nodeType).hoverFrameWidth)
    .attr("height", (d) => getNodeAttributes(d.nodeType).hoverFrameHeight)
    .attr("transform", (d) => {
      const {
        hoverFrameTranslateX,
        hoverFrameTranslateY,
        rotation,
        hoverRotationCenterX,
        hoverRotationCenterY,
      } = getNodeAttributes(d.nodeType);
      // Apply rotation around the center point if it exists
      const rotateTransform = rotation
        ? `rotate(${rotation}, ${hoverRotationCenterX}, ${hoverRotationCenterY})`
        : "";
      return `translate(${hoverFrameTranslateX}, ${hoverFrameTranslateY}) ${rotateTransform}`;
    });
};

export const removeHoverFrame = (nodeGroup, d) => {
  nodeGroup
    .filter((n) => n.name === d.name)
    .selectAll("image.hover-frame")
    .remove();
};

// ========================================= CLICK  EFFECTS
export const animateSkillNodeImage = (nodeGroup, d) => {
  // Select the skill-node-image of the clicked node
  const skillNodeImage = nodeGroup.select(".skill-node-image");

  const scaleFactor = 1.3;

  // Animate the image to be bigger and then back to its original size
  skillNodeImage
    .transition()
    .duration(250) // Customize the duration
    .ease(easeCubicOut) // Apply the easing function
    .attr("transform", (d) => {
      const { frameTranslateX: translateX, frameTranslateY: translateY } =
        getNodeAttributes(d.nodeType);
      const adjustedTranslateX =
        translateX -
        ((scaleFactor - 1) * getNodeAttributes(d.nodeType).frameWidth) / 2;
      const adjustedTranslateY =
        translateY -
        ((scaleFactor - 1) * getNodeAttributes(d.nodeType).frameHeight) / 2;
      return `translate(${adjustedTranslateX}, ${adjustedTranslateY}) scale(${scaleFactor})`;
    })
    .transition()
    .duration(250)
    .attr("transform", (d) => {
      const { frameTranslateX: translateX, frameTranslateY: translateY } =
        getNodeAttributes(d.nodeType);
      return `translate(${translateX}, ${translateY}) scale(1)`;
    });
};

export const addGlowEffect = (nodeGroup, d) => {
  // Select the clicked node group
  const clickedNode = nodeGroup;

  const scaleFactor = 1.8;

  // Check if there's an existing glow image and remove it
  clickedNode.select(".glow-effect").remove();

  const nodeAttributes = getNodeAttributes(d.nodeType);
  const centerX = nodeAttributes.glowTranslateX + nodeAttributes.glowWidth / 2;
  const centerY = nodeAttributes.glowTranslateY + nodeAttributes.glowHeight / 2;

  // Append the glow effect image to the clicked node
  const glowEffectImage = clickedNode
    .insert("image", ".skill-node-image")
    .attr("class", "glow-effect")
    .attr("href", (d) => getNodeAttributes(d.nodeType).glowImage)
    .attr("width", (d) => getNodeAttributes(d.nodeType).glowWidth)
    .attr("height", (d) => getNodeAttributes(d.nodeType).glowHeight)
    .attr("transform", (d) => {
      return `translate(${centerX}, ${centerY}) scale(0) translate(${-centerX}, ${-centerY})`;
    })
    .style("mix-blend-mode", "hard-light"); // Add blend mode using mix-blend-mode property

  // Animate the glow effect to be bigger and then disappear
  glowEffectImage
    .transition()
    .duration(200) // Customize the duration
    .ease(easeCubicOut) // Apply the easing function
    .attr("transform", (d) => {
      return `translate(${
        nodeAttributes.glowTranslateX -
        (nodeAttributes.glowWidth * (scaleFactor - 1)) / 2
      }, ${
        nodeAttributes.glowTranslateY -
        (nodeAttributes.glowHeight * (scaleFactor - 1)) / 2
      }) scale(${scaleFactor})`;
    })
    .attr("opacity", 1) // Animate the opacity to 0
    .transition()
    .duration(850)
    .ease(easeCubicOut) // Apply the exponential easing function with 'Out' mode
    .attr("opacity", 0)
    .remove(); // Remove the glow effect image after the animation
};

export const addFlashEffect = (nodeGroup, d) => {
  // Select the clicked node group
  const clickedNode = nodeGroup;

  const scaleFactor = 1.5;

  // Check if there's an existing flash image and remove it
  clickedNode.select(".flash-effect").remove();

  const nodeAttributes = getNodeAttributes(d.nodeType);
  const centerX = nodeAttributes.glowTranslateX + nodeAttributes.glowWidth / 2;
  const centerY = nodeAttributes.glowTranslateY + nodeAttributes.glowHeight / 2;

  // Append the flash effect image to the clicked node
  const flashEffectImage = clickedNode
    .append("image")
    .attr("class", "flash-effect")
    .attr("href", (d) => getNodeAttributes(d.nodeType).glowImage) // Use the same glow image
    .attr("width", (d) => getNodeAttributes(d.nodeType).glowWidth)
    .attr("height", (d) => getNodeAttributes(d.nodeType).glowHeight)
    .attr("transform", (d) => {
      return `translate(${centerX}, ${centerY}) scale(0) translate(${-centerX}, ${-centerY})`;
    })
    .style("mix-blend-mode", "color-dodge");

  // Animate the flash effect to be bigger and then disappear
  flashEffectImage
    .transition()
    .duration(200) // Fast duration
    .ease(easeCubicOut) // Apply the easing function
    .attr("transform", (d) => {
      return `translate(${
        nodeAttributes.glowTranslateX -
        (nodeAttributes.glowWidth * (scaleFactor - 1)) / 2
      }, ${
        nodeAttributes.glowTranslateY -
        (nodeAttributes.glowHeight * (scaleFactor - 1)) / 2
      }) scale(${scaleFactor})`;
    })
    .attr("opacity", 0.8) // More visible
    .transition()
    .duration(100) // Fast duration
    .ease(easeCubicOut) // Apply the exponential easing function with 'Out' mode
    .attr("opacity", 0)
    .remove(); // Remove the flash effect image after the animation
};
