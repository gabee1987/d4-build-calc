// Images
// import sorcererSpellImagesMap from "../helpers/sorcerer-spell-images-map";
import nodeHubImage_inactive from "../../assets/skill-tree/node-category-disabled.webp";
import nodeHubImage_active from "../../assets/skill-tree/node-category-enabled.webp";
import activeSkillImage_inactive from "../../assets/skill-tree/node-major-disabled.webp";
import activeSkillImage_active from "../../assets/skill-tree/node-major-enabled.webp";
import activeSkillImage_allocateable from "../../assets/skill-tree/node-major-highlighted.webp";
import activeSkillBuffImage_inactive from "../../assets/skill-tree/node-minor-disabled.webp";
import activeSkillBuffImage_active from "../../assets/skill-tree/node-minor-enabled.webp";
import activeSkillBuffImage_allocateable from "../../assets/skill-tree/node-minor-enabled.webp";
import passiveSkillImage_inactive from "../../assets/skill-tree/node-passive-disabled.webp";
import passiveSkillImage_active from "../../assets/skill-tree/node-passive-enabled.webp";
import passiveSkillImage_allocateable from "../../assets/skill-tree/node-passive-enabled.webp";
import capstoneSkillImage_inactive from "../../assets/skill-tree/node-capstone-disabled.webp";
import capstoneSkillImage_active from "../../assets/skill-tree/node-capstone-enabled.webp";
import capstoneSkillImage_allocateable from "../../assets/skill-tree/node-capstone-enabled.webp";

import skillCategoryImage_basic from "../../assets/skill-tree/skill-category/skill-category-basic.webp";
import skillCategoryImage_core from "../../assets/skill-tree/skill-category/skill-category-core.webp";
import skillCategoryImage_defensive from "../../assets/skill-tree/skill-category/sorcerer/skill-category-defensive.webp";
import skillCategoryImage_ultimate from "../../assets/skill-tree/skill-category/skill-category-ultimate.webp";
import skillCategoryImage_capstone from "../../assets/skill-tree/skill-category/skill-category-key-passive.webp";
import skillCategoryImage_brawling from "../../assets/skill-tree/skill-category/barbarian/skill-category-brawling.webp";
import skillCategoryImage_weaponmastery from "../../assets/skill-tree/skill-category/barbarian/skill-category-weaponmastery.webp";
import skillCategoryImage_macabre from "../../assets/skill-tree/skill-category/necromancer/skill-category-macabre.webp";
import skillCategoryImage_corruption from "../../assets/skill-tree/skill-category/necromancer/skill-category-corruption.webp";
import skillCategoryImage_conjuration from "../../assets/skill-tree/skill-category/sorcerer/skill-category-conjuration.webp";
import skillCategoryImage_mastery from "../../assets/skill-tree/skill-category/sorcerer/skill-category-mastery.webp";
import skillCategoryImage_agility from "../../assets/skill-tree/skill-category/rogue/skill-category-agility.webp";
import skillCategoryImage_subterfuge from "../../assets/skill-tree/skill-category/rogue/skill-category-subterfuge.webp";
import skillCategoryImage_imbuements from "../../assets/skill-tree/skill-category/rogue/skill-category-imbuements.webp";
import skillCategoryImage_companion from "../../assets/skill-tree/skill-category/druid/skill-category-companion.webp";
import skillCategoryImage_wrath from "../../assets/skill-tree/skill-category/druid/skill-category-wrath.webp";

import activeSkillHoverFrame from "../../assets/skill-tree/node-active-skill-hover-frame.webp";
import capstoneSkillHoverFrame from "../../assets/skill-tree/node-capstone-skill-hover-frame.webp";

import activeSkillClickGlow from "../../assets/skill-tree/active-skill-click-glow.webp";
import activeSkillClickCircle from "../../assets/skill-tree/active-skill-click-circle.webp";
import activeSkillClickFlash from "../../assets/skill-tree/active-skill-click-flash.webp";

import xMarkImage from "../../assets/skill-tree/x-mark.webp";

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
        // Inactive Frame
        image: activeSkillImage_inactive,
        frameWidth: 100,
        frameHeight: 100,
        frameTranslateX: -50,
        frameTranslateY: -50,
        frameTooltipWidth: 100,
        frameTooltipHeight: 100,
        frameTooltipTranslateX: -50,
        frameTooltipTranslateY: -60,
        // Spell image
        spellWidth: 104 / 1.65,
        spellHeight: 104 / 1.65,
        spellTranslateX: -52 / 1.65,
        spellTranslateY: -53 / 1.65,
        spellTooltipWidth: 104 / 1.65,
        spellTooltipHeight: 104 / 1.65,
        spellTooltipTranslateX: -52 / 1.65,
        spellTooltipTranslateY: -70 / 1.65,
        // Hover Frame
        hoverFrameImage: activeSkillHoverFrame,
        hoverFrameWidth: 90,
        hoverFrameHeight: 90,
        hoverFrameTranslateX: -45,
        hoverFrameTranslateY: -45,
        rotation: 0,
        rotationCenterX: 0,
        rotationCenterY: 0,
        // Click
        glowImage: activeSkillClickGlow,
        glowWidth: 120,
        glowHeight: 120,
        glowTranslateX: -60,
        glowTranslateY: -60,
        flashImage: activeSkillClickFlash,
        circleImage: activeSkillClickCircle,
        circleWidth: 120,
        circleHeight: 120,
        circleTranslateX: -60,
        circleTranslateY: -60,
        // X Mark
        xMarkImage: xMarkImage,
        xImageWidth: 60,
        xImageHeight: 60,
        xImageTranslateX: -30,
        xImageTranslateY: -30,
      };
    case "activeSkillBuff":
      return {
        class: "node active-skill-buff-node",
        // Inactive Frame
        image: activeSkillBuffImage_inactive,
        frameWidth: 60,
        frameHeight: 60,
        frameTranslateX: -30,
        frameTranslateY: -30,
        frameTooltipWidth: 80,
        frameTooltipHeight: 80,
        frameTooltipTranslateX: -40,
        frameTooltipTranslateY: -50,
        // Spell image
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
        // Hover Frame
        hoverFrameImage: activeSkillHoverFrame,
        hoverFrameWidth: 50,
        hoverFrameHeight: 50,
        hoverFrameTranslateX: -25,
        hoverFrameTranslateY: -25,
        hoverRotationCenterX: 50 / 0.98 / 2,
        hoverRotationCenterY: 50 / 0.98 / 2,
        // Click
        glowImage: activeSkillClickGlow,
        glowWidth: 60,
        glowHeight: 60,
        glowTranslateX: -30,
        glowTranslateY: -30,
        flashImage: activeSkillClickFlash,
        circleImage: activeSkillClickCircle,
        circleWidth: 75,
        circleHeight: 75,
        circleTranslateX: -37.5,
        circleTranslateY: -37.5,
      };
    case "activeSkillUpgrade":
      return {
        class: "node active-skill-buff-node",
        // Inactive Frame
        image: activeSkillBuffImage_inactive,
        frameWidth: 60,
        frameHeight: 60,
        frameTranslateX: -30,
        frameTranslateY: -30,
        frameTooltipWidth: 80,
        frameTooltipHeight: 80,
        frameTooltipTranslateX: -40,
        frameTooltipTranslateY: -50,
        // Spell image
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
        // Hover Frame
        hoverFrameImage: activeSkillHoverFrame,
        hoverFrameWidth: 50,
        hoverFrameHeight: 50,
        hoverFrameTranslateX: -25,
        hoverFrameTranslateY: -25,
        hoverRotationCenterX: 50 / 0.98 / 2,
        hoverRotationCenterY: 50 / 0.98 / 2,
        // Click
        glowImage: activeSkillClickGlow,
        glowWidth: 60,
        glowHeight: 60,
        glowTranslateX: -30,
        glowTranslateY: -30,
        flashImage: activeSkillClickFlash,
        circleImage: activeSkillClickCircle,
        circleWidth: 75,
        circleHeight: 75,
        circleTranslateX: -37.5,
        circleTranslateY: -37.5,
        // X Mark
        xMarkImage: xMarkImage,
        xImageWidth: 30,
        xImageHeight: 30,
        xImageTranslateX: -15,
        xImageTranslateY: -15,
      };
    case "passiveSkill":
      return {
        class: "node passive-skill-node",
        // Inactive Frame
        image: passiveSkillImage_inactive,
        frameWidth: 40,
        frameHeight: 40,
        frameTranslateX: -20,
        frameTranslateY: -20,
        frameTooltipWidth: 60,
        frameTooltipHeight: 60,
        frameTooltipTranslateX: -35,
        frameTooltipTranslateY: -40,
        // Spell image
        spellWidth: 63 / 1.65,
        spellHeight: 63 / 1.65,
        spellTranslateX: -31.5 / 1.65,
        spellTranslateY: -31 / 1.65,
        spellTooltipWidth: 97 / 1.65,
        spellTooltipHeight: 97 / 1.65,
        spellTooltipTranslateX: -57 / 1.65,
        spellTooltipTranslateY: -65 / 1.65,
        // Hover Frame
        hoverFrameImage: capstoneSkillHoverFrame,
        hoverFrameWidth: 50,
        hoverFrameHeight: 50,
        hoverFrameTranslateX: -25,
        hoverFrameTranslateY: -25,
        hoverRotationCenterX: 45 / 0.98 / 2,
        hoverRotationCenterY: 45 / 0.98 / 2,
        // Click
        glowImage: activeSkillClickGlow,
        glowWidth: 60,
        glowHeight: 60,
        glowTranslateX: -30,
        glowTranslateY: -30,
        flashImage: activeSkillClickFlash,
        circleImage: activeSkillClickCircle,
        circleWidth: 60,
        circleHeight: 60,
        circleTranslateX: -30,
        circleTranslateY: -30,
      };
    case "capstoneSkill":
      return {
        class: "node capstone-skill-node",
        // Inactive Frame
        image: capstoneSkillImage_inactive,
        frameWidth: 100,
        frameHeight: 100,
        frameTranslateX: -50,
        frameTranslateY: -50,
        frameTooltipWidth: 100,
        frameTooltipHeight: 100,
        frameTooltipTranslateX: -55,
        frameTooltipTranslateY: -60,
        spellWidth: 85 / 1.65,
        spellHeight: 85 / 1.65,
        spellTranslateX: -42.5 / 1.65,
        spellTranslateY: -42.5 / 1.65,
        spellTooltipWidth: 84 / 1.65,
        spellTooltipHeight: 84 / 1.65,
        spellTooltipTranslateX: -50 / 1.65,
        spellTooltipTranslateY: -58 / 1.65,
        // Hover Frame
        hoverFrameImage: capstoneSkillHoverFrame,
        hoverFrameWidth: 65,
        hoverFrameHeight: 65,
        hoverFrameTranslateX: -32.5,
        hoverFrameTranslateY: -32.5,
        hoverRotationCenterX: 45 / 0.98 / 2,
        hoverRotationCenterY: 45 / 0.98 / 2,
        // Click
        glowImage: activeSkillClickGlow,
        glowWidth: 120,
        glowHeight: 120,
        glowTranslateX: -60,
        glowTranslateY: -60,
        flashImage: activeSkillClickFlash,
        circleImage: activeSkillClickCircle,
        circleWidth: 100,
        circleHeight: 100,
        circleTranslateX: -50,
        circleTranslateY: -50,
        // X Mark
        xMarkImage: xMarkImage,
        xImageWidth: 40,
        xImageHeight: 40,
        xImageTranslateX: -20,
        xImageTranslateY: -20,
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
  // console.log(isActive);
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
    case "activeSkillUpgrade":
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

export const getSkillCategoryImage = (node) => {
  if (!node.nodeType && node.nodeType !== "nodeHub" && !node.name) {
    return;
  }
  switch (node.name.toLowerCase()) {
    // Common
    case "basic":
      return {
        image: skillCategoryImage_basic,
      };
    case "core":
      return {
        image: skillCategoryImage_core,
      };
    case "ultimate":
      return {
        image: skillCategoryImage_ultimate,
      };
    case "capstone":
      return {
        image: skillCategoryImage_capstone,
      };
    // Barbarian, Druid, Sorcerer
    case "defensive":
      return {
        image: skillCategoryImage_defensive,
      };
    // Barbarian
    case "brawling":
      return {
        image: skillCategoryImage_brawling,
      };
    case "weapon mastery":
      return {
        image: skillCategoryImage_weaponmastery,
      };
    // Necromancer
    case "macabre":
      return {
        image: skillCategoryImage_macabre,
      };
    case "corruption":
      return {
        image: skillCategoryImage_corruption,
      };
    case "summoning":
      return {
        image: skillCategoryImage_macabre,
      };
    // Rogue
    case "agility":
      return {
        image: skillCategoryImage_agility,
      };
    case "subterfuge":
      return {
        image: skillCategoryImage_subterfuge,
      };
    case "imbuements":
      return {
        image: skillCategoryImage_imbuements,
      };
    // Sorcerer
    case "conjuration":
      return {
        image: skillCategoryImage_conjuration,
      };
    case "mastery":
      return {
        image: skillCategoryImage_mastery,
      };
    // Druid
    case "wrath":
      return {
        image: skillCategoryImage_wrath,
      };
    case "spirit":
      return {
        image: skillCategoryImage_core,
      };
    case "companion":
      return {
        image: skillCategoryImage_companion,
      };
    default:
      return {
        image: skillCategoryImage_basic,
      };
  }
};
