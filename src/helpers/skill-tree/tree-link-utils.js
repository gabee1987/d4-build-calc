import * as d3 from "d3";

import nodeHubLinkImage from "../../assets/skill-tree/node-line-category.webp";
import nodeHubLinkImage_active from "../../assets/skill-tree/node-line-category-active-fill.webp";
import nodeLinkImage from "../../assets/skill-tree/node-line-skill.webp";
import nodeLinkImage_active from "../../assets/skill-tree/node-line-skill-active-fill.webp";

// Get the link types based on the source and target node type
export const getLinkType = (source, target) => {
  if (source.nodeType === "nodeHub" && target.nodeType === "nodeHub") {
    return "hubLink";
  }
  return "nodeLink";
};

// Create custom link properties based on link type
export const getLinkAttributes = (source, target) => {
  const linkType = getLinkType(source, target);

  if (linkType === "hubLink") {
    return {
      class: "hub-link",
      linkWidth: 260,
      linkHeight: 260,
      image: nodeHubLinkImage,
      image_active: nodeHubLinkImage_active,
    };
  } else {
    return {
      class: "node-link",
      linkWidth: 70,
      linkHeight: 70,
      image: nodeLinkImage,
      image_active: nodeLinkImage_active,
    };
  }
};

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
  pattern
    .append("image")
    .attr("href", nodeLinkImage)
    .attr("width", 260)
    .attr("height", 260);

  // Add the active link image with the mask
  pattern
    .append("image")
    .attr("href", nodeLinkImage_active)
    .attr("width", 260)
    .attr("height", 260)
    .attr("mask", "url(#linkImageMask)");
};

export const drawLinksBetweenNodes = (
  containerGroup,
  svg,
  links,
  totalAllocatedPoints
) => {
  containerGroup
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr(
      "class",
      (d) => getLinkAttributes(d.source, d.target, totalAllocatedPoints).class
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
        getLinkAttributes(d.source, d.target, totalAllocatedPoints).linkWidth
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
          getLinkAttributes(d.source, d.target, totalAllocatedPoints).linkWidth
        )
        .attr(
          "height",
          getLinkAttributes(d.source, d.target, totalAllocatedPoints).linkHeight
        );
      return `url(#${id})` || "none";
    });

  return containerGroup.selectAll("path").data(links);
};

export const drawActiveLinksBetweenNodes = (
  containerGroup,
  svg,
  links,
  totalAllocatedPoints
) => {
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
        getLinkAttributes(d.source, d.target, totalAllocatedPoints).linkWidth
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
};

export const updateLinkElements = (containerGroup, links) => {
  return containerGroup.selectAll("path").data(links);
};

// TODO NEED TO FIX THIS
export const updateLinksOnNodeAllocation = (
  activeLinkElements,
  nodes,
  totalPoints
) => {
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
};
