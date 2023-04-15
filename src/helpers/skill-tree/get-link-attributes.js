import nodeHubLinkImage from "../../assets/skill-tree/node-line-category.webp";
import nodeLinkImage from "../../assets/skill-tree/node-line-skill.webp";

// Get the link types based on the source and target node type
export const getLinkType = (source, target) => {
  if (source.nodeType === "nodeHub" && target.nodeType === "nodeHub") {
    return "hubLink";
  }
  return "nodeLink";
};

// Create custom link properties based on link type
// export const getLinkAttributes = (source, target, linkColor) => {
//   const linkType = getLinkType(source, target);

//   if (linkType === "hubLink") {
//     return {
//       class: "hub-link",
//       linkFill: linkColor,
//       linkWidth: 260,
//       linkHeight: 260,
//       image: nodeHubLinkImage,
//     };
//   } else {
//     return {
//       class: "node-link",
//       linkFill: linkColor,
//       linkWidth: 70,
//       linkHeight: 70,
//       image: nodeLinkImage,
//     };
//   }
// };
