// Images
// import sorcererSpellImagesMap from "../helpers/sorcerer-spell-images-map";
import nodeHubImage_inactive from "../../assets/skill-tree/node-category-disabled.webp";
import nodeHubImage_active from "../../assets/skill-tree/node-category-enabled.webp";
import activeSkillImage_inactive from "../../assets/skill-tree/node-major-disabled.webp";
import activeSkillImage_active from "../../assets/skill-tree/node-major-enabled.webp";
import activeSkillBuffImage_inactive from "../../assets/skill-tree/node-minor-disabled.webp";
import activeSkillBuffImage_active from "../../assets/skill-tree/node-minor-enabled.webp";
import passiveSkillImage_inactive from "../../assets/skill-tree/node-passive-disabled.webp";
import passiveSkillImage_active from "../../assets/skill-tree/node-passive-enabled.webp";
import capstoneSkillImage_inactive from "../../assets/skill-tree/node-capstone-disabled.webp";
import capstoneSkillImage_active from "../../assets/skill-tree/node-capstone-enabled.webp";

import skillCategoryImage_basic from "../../assets/skill-tree/sorcerer/skill-category-basic.webp";
import skillCategoryImage_core from "../../assets/skill-tree/sorcerer/skill-category-core.webp";
import skillCategoryImage_defensive from "../../assets/skill-tree/sorcerer/skill-category-defensive.webp";
import skillCategoryImage_conjuration from "../../assets/skill-tree/sorcerer/skill-category-conjuration.webp";
import skillCategoryImage_mastery from "../../assets/skill-tree/sorcerer/skill-category-mastery.webp";
import skillCategoryImage_ultimate from "../../assets/skill-tree/sorcerer/skill-category-ultimate.webp";
import skillCategoryImage_capstone from "../../assets/skill-tree/sorcerer/skill-category-key-passive.webp";

export const getNodeAttributes = (nodeType) => {
  switch (nodeType) {
    case "nodeHub":
      return {
        class: "node node-hub",
        image: nodeHubImage_inactive,
        frameWidth: 160,
        frameHeight: 160,
        frameTranslateX: -80,
        frameTranslateY: -80,
        spellWidth: 50 / 1.65,
        spellHeight: 50 / 1.65,
        spellTranslateX: -25 / 1.65,
        spellTranslateY: -25 / 1.65,
        skillCategoryImageWidth: 100,
        skillCategoryImageHeight: 100,
        skillCategoryTranslateX: -50,
        skillCategoryTranslateY: -50,
      };
    case "activeSkill":
      return {
        class: "node active-skill-node",
        image: activeSkillImage_inactive,
        frameWidth: 100,
        frameHeight: 100,
        frameTranslateX: -50,
        frameTranslateY: -50,
        frameTooltipWidth: 100,
        frameTooltipHeight: 100,
        frameTooltipTranslateX: -50,
        frameTooltipTranslateY: -60,
        spellWidth: 104 / 1.65,
        spellHeight: 104 / 1.65,
        spellTranslateX: -52 / 1.65,
        spellTranslateY: -53 / 1.65,
        spellTooltipWidth: 104 / 1.65,
        spellTooltipHeight: 104 / 1.65,
        spellTooltipTranslateX: -52 / 1.65,
        spellTooltipTranslateY: -70 / 1.65,
      };
    case "activeSkillBuff":
      return {
        class: "node active-skill-buff-node",
        image: activeSkillBuffImage_inactive,
        frameWidth: 60,
        frameHeight: 60,
        frameTranslateX: -30,
        frameTranslateY: -30,
        frameTooltipWidth: 80,
        frameTooltipHeight: 80,
        frameTooltipTranslateX: -40,
        frameTooltipTranslateY: -50,
        spellWidth: 44 / 1.65,
        spellHeight: 44 / 1.65,
        spellTranslateX: -22 / 1.65,
        spellTranslateY: -23 / 1.65,
        rotation: 45,
        rotationCenterX: 45 / 1.65 / 2,
        rotationCenterY: 45 / 1.65 / 2,
        spellTooltipWidth: 58 / 1.65,
        spellTooltipHeight: 58 / 1.65,
        spellTooltipTranslateX: -28 / 1.65,
        spellTooltipTranslateY: -48 / 1.65,
      };
    case "passiveSkill":
      return {
        class: "node passive-skill-node",
        image: passiveSkillImage_inactive,
        frameWidth: 40,
        frameHeight: 40,
        frameTranslateX: -20,
        frameTranslateY: -20,
        frameTooltipWidth: 60,
        frameTooltipHeight: 60,
        frameTooltipTranslateX: -35,
        frameTooltipTranslateY: -40,
        spellWidth: 63 / 1.65,
        spellHeight: 63 / 1.65,
        spellTranslateX: -31.5 / 1.65,
        spellTranslateY: -31 / 1.65,
        spellTooltipWidth: 97 / 1.65,
        spellTooltipHeight: 97 / 1.65,
        spellTooltipTranslateX: -57 / 1.65,
        spellTooltipTranslateY: -65 / 1.65,
      };
    case "capstoneSkill":
      return {
        class: "node capstone-skill-node",
        image: capstoneSkillImage_inactive,
        frameWidth: 100,
        frameHeight: 100,
        frameTranslateX: -50,
        frameTranslateY: -50,
        frameTooltipWidth: 50,
        frameTooltipHeight: 50,
        frameTooltipTranslateX: -25,
        frameTooltipTranslateY: -25,
        spellWidth: 85 / 1.65,
        spellHeight: 85 / 1.65,
        spellTranslateX: -42.5 / 1.65,
        spellTranslateY: -42.5 / 1.65,
        spellTooltipWidth: 42.5 / 1.65,
        spellTooltipHeight: 42.5 / 1.65,
        spellTooltipTranslateX: -21.25 / 1.65,
        spellTooltipTranslateY: -21.25 / 1.65,
      };
    default:
      return {
        class: "node",
        image: "need-default-image-here",
        frameWidth: 50,
        frameHeight: 50,
        frameTranslateX: -25,
        frameTranslateY: -25,
        frameTooltipWidth: 50,
        frameTooltipHeight: 50,
        frameTooltipTranslateX: -50,
        frameTooltipTranslateY: -50,
        spellWidth: 150 / 1.65,
        spellHeight: 150 / 1.65,
        spellTranslateX: -75 / 1.65,
        spellTranslateY: -75 / 1.65,
      };
  }
};

// Get node image based on state and type
export const getNodeImage = (nodeType, isActive, isAllocate = true) => {
  console.log(isActive);
  switch (nodeType) {
    case "nodeHub":
      return isActive ? nodeHubImage_active : nodeHubImage_inactive;
    case "activeSkill":
      return isActive && isAllocate
        ? activeSkillImage_active
        : activeSkillImage_inactive;
    case "activeSkillBuff":
      return isActive && isAllocate
        ? activeSkillBuffImage_active
        : activeSkillBuffImage_inactive;
    case "passiveSkill":
      return isActive && isAllocate
        ? passiveSkillImage_active
        : passiveSkillImage_inactive;
    case "capstoneSkill":
      return isActive && isAllocate
        ? capstoneSkillImage_active
        : capstoneSkillImage_inactive;
    case "default":
      return passiveSkillImage_inactive;
    default:
      console.error("Unknown node type:", nodeType);
      return "path/to/defaultImage.svg"; // Return a default image in case of an unknown node type
  }
};

export const getSkillCategoryImages = () => {
  return (node) => {
    if (!node.nodeType && node.nodeType !== "nodeHub" && !node.name) {
      return;
    }

    switch (node.name.toLowerCase()) {
      case "basic":
        return {
          image: skillCategoryImage_basic,
        };
      case "core":
        return {
          image: skillCategoryImage_core,
        };
      case "defensive":
        return {
          image: skillCategoryImage_defensive,
        };
      case "conjuration":
        return {
          image: skillCategoryImage_conjuration,
        };
      case "mastery":
        return {
          image: skillCategoryImage_mastery,
        };
      case "ultimate":
        return {
          image: skillCategoryImage_ultimate,
        };
      case "capstone":
        return {
          image: skillCategoryImage_capstone,
        };
      default:
        return {
          image: skillCategoryImage_basic,
        };
    }
  };
};
