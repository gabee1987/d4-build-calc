import nodeHubLinkImage from "../../assets/skill-tree/node-line-category.webp";
import nodeHubLinkImage_active from "../../assets/skill-tree/node-line-category-active-fill.webp";
import nodeLinkImage from "../../assets/skill-tree/node-line-skill.webp";
import nodeLinkImage_active from "../../assets/skill-tree/node-line-skill-active-fill.webp";
import nodeHubLinkImage_active_anim from "../../assets/skill-tree/lava-animation.gif";

// Get the link types based on the source and target node type
export const getLinkType = (source, target) => {
  if (source.nodeType === "nodeHub" && target.nodeType === "nodeHub") {
    return "hubLink";
  }
  return "nodeLink";
};

// Create custom link properties based on link type
// TODO need to extract this to a separate file
export const getLinkAttributes = (source, target, totalPoints) => {
  const linkType = getLinkType(source, target);

  if (linkType === "hubLink") {
    return {
      type: "hubLink",
      class: "hub-link",
      linkWidth: 260,
      linkHeight: 260,
      linkWidth_active: 295,
      linkHeight_active: 295,
      image: nodeHubLinkImage,
      image_active: nodeHubLinkImage_active,
    };
  } else {
    return {
      type: "nodeLink",
      class: "node-link",
      linkWidth: 70,
      linkHeight: 70,
      linkWidth_active: 70,
      linkHeight_active: 70,
      image: nodeLinkImage,
      image_active: nodeLinkImage_active,
    };
  }
};
