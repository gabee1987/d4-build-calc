import * as d3 from "d3";
import {
  easeCubic,
  easeCubicOut,
  easeCubicInOut,
  easeBounceOut,
  easeCircleIn,
  easeLinear,
} from "d3-ease";

import { getLinkAttributes } from "./get-link-attributes";
import { getNodeAttributes, getNodeImage } from "./get-node-attributes";

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

export const drawActiveLinkImage = (
  svg,
  containerGroup,
  allocatedLink,
  index,
  node
) => {
  const firstSkillNodeImageParent = containerGroup
    .select(".skill-node-image")
    .node().parentNode;

  if (node.allocatedPoints > 1) {
    return;
  }

  containerGroup
    .insert("path", () => firstSkillNodeImageParent)
    .datum(allocatedLink)
    .attr("class", "activePath")
    .attr("clip-path", () => `url(#clip${index})`)
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

      // Generate a unique ID for the pattern using source and target node IDs
      const id = `activeLinkImagePattern_${d.source.id}_${d.target.id}`;

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

      // Check if the pattern with the same ID already exists
      let pattern = svg.select(`#${id}`);

      if (pattern.empty()) {
        // If it doesn't exist, create a new pattern
        pattern = svg
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
          );

        pattern
          .append("image")
          .attr("href", linkImage)
          .attr("width", linkWidth)
          .attr("height", linkHeight);
      }

      return `url(#${id})` || "none";
    });
};

export const removeActiveLinkImage = (
  node,
  parentNode,
  containerGroup,
  svg,
  links
) => {
  // Find the related links by filtering the links
  const relatedLinks = links.filter(
    (link) => link.source.id === parentNode.id && link.target.id === node.id
  );

  // Remove the patterns and paths for the related links
  relatedLinks.forEach((link) => {
    const patternId = `activeLinkImagePattern_${link.source.id}_${link.target.id}`;
    const pattern = svg.select(`#${patternId}`);
    if (!pattern.empty()) {
      pattern.remove();
    }

    const path = containerGroup.select(
      `.activePath[data-source-id="${link.source.id}"][data-target-id="${link.target.id}"]`
    );
    if (!path.empty()) {
      path.remove();
    }
  });
};

export const updateLinkElements = (containerGroup, links) => {
  return containerGroup.selectAll("path").data(links);
};

// ========================================= LINK  HIGHLIGHT
export const getLinksToHighlight = (nodes, links) => {
  console.log(nodes);
  console.log(links);
  const linksToHighlight = [];

  nodes.forEach((node) => {
    if (node.nodeType === "nodeHub" && node.requiredPoints === 0) {
      links.forEach((link) => {
        const childNode =
          link.source.id === node.id
            ? link.target
            : link.target.id === node.id
            ? link.source
            : null;

        if (childNode && childNode.allocatedPoints === 0) {
          linksToHighlight.push(link);
        }
      });
    } else if (node.allocatedPoints > 0) {
      links.forEach((link) => {
        const parentNode =
          link.source.id === node.id
            ? link.target
            : link.target.id === node.id
            ? link.source
            : null;

        if (
          parentNode &&
          parentNode.nodeType === "nodeHub" &&
          parentNode.requiredPoints <= node.allocatedPoints
        ) {
          linksToHighlight.push(link);
        }
      });
    }
  });

  console.log(linksToHighlight);
  return linksToHighlight;
};

// ========================================= NODEHUB ACTIVE LINK PROGRESS
const calculatePortionSize = (
  currentNodeHub,
  nextNodeHub,
  totalAllocatedPoints
) => {
  const requiredPointsDifference = nextNodeHub
    ? nextNodeHub.requiredPoints - currentNodeHub.requiredPoints
    : currentNodeHub.requiredPoints;
  const allocatedPointsDifference =
    totalAllocatedPoints - currentNodeHub.requiredPoints;

  const portionSize = Math.max(
    Math.min(allocatedPointsDifference / requiredPointsDifference, 1),
    0
  );

  return portionSize;
};

export const drawActiveNodeHubLinkImage = (
  svg,
  containerGroup,
  index,
  nodes,
  totalPoints
) => {
  if (totalPoints > 33) return;

  // Find the nodeHubs from the nodes array
  const nodeHubs = nodes.filter((node) => node.nodeType === "nodeHub");
  const currentNodeHub = nodeHubs.find(
    (nodeHub, index) =>
      totalPoints >= nodeHub.requiredPoints &&
      totalPoints <= nodeHubs[index + 1]?.requiredPoints
  );

  const nextNodeHub =
    nodeHubs.find((nodeHub) => totalPoints <= nodeHub.requiredPoints) ||
    nodeHubs[nodeHubs.length - 1];

  const firstSkillNodeImageParent = containerGroup
    .select(".skill-node-image")
    .node().parentNode;

  // Remove data-current-link attribute from all paths
  containerGroup
    .selectAll("path.activeNodeHubPath")
    .attr("data-current-link", null);

  containerGroup
    .insert("path", () => firstSkillNodeImageParent)
    .datum({ source: currentNodeHub, target: nextNodeHub })
    .attr("class", "activeNodeHubPath")
    //.attr("data-current-link", "true")
    .attr("data-min-points", currentNodeHub.requiredPoints)
    .attr("data-max-points", nextNodeHub.requiredPoints)
    .attr("data-allocated-points", totalPoints)
    .attr("data-portion-id", Date.now())
    .attr("d", () => {
      const sourceX = currentNodeHub.x * 5 - 1775;
      const sourceY = currentNodeHub.y * 5 - 1045;
      const targetX = nextNodeHub.x * 5 - 1775;
      const targetY = nextNodeHub.y * 5 - 1045;

      const portionSize = calculatePortionSize(
        currentNodeHub,
        nextNodeHub,
        totalPoints
      );
      const targetX_portion = sourceX + (targetX - sourceX) * portionSize;
      const targetY_portion = sourceY + (targetY - sourceY) * portionSize;

      return `M${sourceX},${sourceY} L${targetX_portion},${targetY_portion}`;
    })
    .attr(
      "stroke-width",
      getLinkAttributes(currentNodeHub, nextNodeHub).linkWidth
    )
    .attr("fill", "none")
    .attr("stroke", () => {
      const sourceX = currentNodeHub.x * 5 - 1775;
      const sourceY = currentNodeHub.y * 5 - 1045;
      const targetX = nextNodeHub.x * 5 - 1775;
      const targetY = nextNodeHub.y * 5 - 1045;

      const linkWidth = getLinkAttributes(
        currentNodeHub,
        nextNodeHub
      ).linkWidth_active;
      const linkHeight = getLinkAttributes(
        currentNodeHub,
        nextNodeHub
      ).linkHeight_active;
      const linkImage = getLinkAttributes(
        currentNodeHub,
        nextNodeHub
      ).image_active;
      const angle =
        (Math.atan2(targetY - sourceY, targetX - sourceX) * 180) / Math.PI;
      const id = `activeLinkImagePattern_${currentNodeHub.id}_${nextNodeHub.id}`;

      const centerX = sourceX + (targetX - sourceX) / 2;
      const centerY = sourceY + (targetY - sourceY) / 2;

      const halfWidth = linkWidth / 2;
      const halfHeight = linkHeight / 2;

      const offsetX =
        halfWidth * Math.cos(angle * (Math.PI / 180)) -
        halfHeight * Math.sin(angle * (Math.PI / 180));
      const offsetY =
        halfWidth * Math.sin(angle * (Math.PI / 180)) +
        halfHeight * Math.cos(angle * (Math.PI / 180));

      const translateX = centerX - offsetX;
      const translateY = centerY - offsetY;

      let pattern = svg.select(`#${id}`);

      if (pattern.empty()) {
        pattern = svg
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
          );

        pattern
          .append("image")
          .attr("href", linkImage)
          .attr("width", linkWidth)
          .attr("height", linkHeight);
      }

      return `url(#${id})` || "none";
    })
    .attr("stroke-dasharray", function () {
      // Set the stroke dasharray to the path length (creating a dashed line with a single dash)
      const pathLength = this.getTotalLength();
      return `${pathLength} ${pathLength}`;
    })
    .attr("stroke-dashoffset", function () {
      // Set the initial stroke dashoffset to the path length (hiding the path)
      return this.getTotalLength();
    })
    .transition() // Start the transition
    .duration(1500) // Set the animation duration (in milliseconds)
    .ease(easeCubicOut) // Set the easing function (optional)
    .attr("stroke-dashoffset", 0) // Animate the stroke dashoffset from the path length to 0 (revealing the path);
    // .attr("data-current-link", "true");
    .on("end", function () {
      // Remove data-current-link attribute from all paths before adding it to the new one
      containerGroup
        .selectAll("path.activeNodeHubPath")
        .attr("data-current-link", null);
      d3.select(this).attr("data-current-link", "true");
    });
};

const getCurrentNodeHubIndex = (nodeHubs, totalPoints) => {
  for (let i = 0; i < nodeHubs.length; i++) {
    if (
      totalPoints >= nodeHubs[i].requiredPoints &&
      totalPoints < nodeHubs[i + 1]?.requiredPoints
    ) {
      return i;
    }
  }
};

let removalInProgress = false;

export const removeActiveNodeHubLinkImage = (containerGroup, totalPoints) => {
  const allPaths = containerGroup.selectAll(".activeNodeHubPath").nodes();
  if (allPaths.length === 0) return;
  console.log("allPaths -> ", allPaths);

  // Sort paths by the data-portion-id attribute in descending order
  const sortedPaths = allPaths.sort((a, b) => {
    return (
      parseInt(b.getAttribute("data-portion-id")) -
      parseInt(a.getAttribute("data-portion-id"))
    );
  });

  console.log("sortedPaths -> ", sortedPaths);

  const lastPath = d3.select(sortedPaths[0]); // Select the last added path
  console.log("lastPath -> ", lastPath);
  console.log(lastPath.node().tagName); // should output "path"

  if (!lastPath.empty()) {
    lastPath.remove();

    // TODO need to find a solution to remove the links with animations,
    // TODO there is an issue when removing the point very fast
    // Interrupt any ongoing transition
    // lastPath.interrupt().remove();
    // const length = lastPath.node().getTotalLength();
    // const duration = length / 0.5;

    // lastPath
    //   .attr("stroke-dasharray", `${length} ${length}`)
    //   .attr("stroke-dashoffset", 0)
    //   .transition()
    //   .duration(duration)
    //   .ease(easeCubicOut)
    //   .attr("stroke-dashoffset", length)
    //   .on("end", () => {
    //     lastPath.remove();
    //     if (sortedPaths.length > 1) {
    //       const secondLastPath = d3.select(sortedPaths[1]);
    //       console.log("secondLastPath -> ", secondLastPath);
    //       secondLastPath.attr("data-current-link", "true");
    //     }
    //   });
  }
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

// ========================================= TREE RESET
export const resetNodes = ({ nodes, links, svg, nodeGroup }) => {
  console.log("reset all nodes... -> ");
  console.log("nodes when reset -> ", nodes);
  console.log("links when reset -> ", links);
  console.log("nodeGroup in resetNodes", nodeGroup);

  nodes.forEach((node) => {
    if (node.nodeType !== "nodeHub") {
      node.allocatedPoints = 0;

      // Remove active links
      svg
        .selectAll("path.activePath")
        .filter(
          (d) => d.target.name === node.name || d.source.name === node.name
        )
        .remove();

      // console.log("nodeImage -> ", getNodeImage(node.nodeType, false));

      nodeGroup
        .filter((d) => d.name === node.name)
        .select("image.skill-node-image")
        .each(function () {
          console.log("image element in updateNodeFrameOnPointChange:", this);
        })
        .classed("allocated-node", false)
        .attr("width", getNodeAttributes(node.nodeType).width)
        .attr("height", getNodeAttributes(node.nodeType).frameHeight)
        .attr("transform", () => {
          const { frameTranslateX: translateX, frameTranslateY: translateY } =
            getNodeAttributes(node.nodeType);
          return `translate(${translateX}, ${translateY})`;
        })
        .attr("href", getNodeImage(node.nodeType, { isNodeActive: false }));
    } else {
      // Remove activeNodeHubPath links for nodeHub type nodes
      svg
        .selectAll("path.activeNodeHubPath")
        .filter(
          (d) => d.target.name === node.name || d.source.name === node.name
        )
        .remove();
    }
  });

  // Force update the D3.js visualization
  nodeGroup.each(function (d) {
    d3.select(this).selectAll("*").attr("__force_update__", Date.now());
  });
};
