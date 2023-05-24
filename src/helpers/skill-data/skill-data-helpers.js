import fireDmgIcon from "../../assets/dmg-icons/fire-damage-icon-diablo-4.webp";
import coldDmgIcon from "../../assets/dmg-icons/cold-damage-icon-diablo-4.webp";
import lightningDmgIcon from "../../assets/dmg-icons/lightning-damage-icon-diablo-4.webp";
import poisonDmgIcon from "../../assets/dmg-icons/poison-damage-icon-diablo-4.webp";
import shadowDmgIcon from "../../assets/dmg-icons/shadow-damage-icon-diablo-4.webp";
import physicalDmgIcon from "../../assets/dmg-icons/physical-damage-icon-diablo-4.webp";

// ========================== EXTRACT
export function extractResourceGeneration(description) {
  let lines = description.split("\n");
  let resourceGenerationLine = lines.find((line) =>
    line.startsWith("Generate")
  );
  return resourceGenerationLine || "";
}

export function extractResourceCost(description) {
  let lines = description.split("\n");
  let resourceCostLine = lines.find((line) => line.endsWith("Cost: {#}"));
  return resourceCostLine || "";
}

export const extractLuckyHit = (description) => {
  let lines = description.split("\n");
  let luckyHitLine = lines.find((line) => line.startsWith("Lucky"));
  return luckyHitLine || "";
};

export const extractCooldown = (description) => {
  let lines = description.split("\n");
  let cooldownLine = lines.find((line) => line.startsWith("Cooldown"));
  return cooldownLine || "";
};

export const extractCharges = (description) => {
  let lines = description.split("\n");
  let chargesLine = lines.find((line) => line.startsWith("Charges"));
  return chargesLine || "";
};

export const removeExtractedLines = (description) => {
  let lines = description.split("\n");
  const extractedLines = [
    extractResourceGeneration(description),
    extractResourceCost(description),
    extractLuckyHit(description),
    extractCooldown(description),
  ];

  const cleanedDescription = lines
    .filter((line) => !extractedLines.includes(line))
    .join("\n");

  return cleanedDescription;
};

// ========================== REPLACE
export function replaceResourceCost(description, manaCostValues) {
  if (!description.includes("{#}") || manaCostValues.length === 0)
    return description;
  return description.replace("{#}", manaCostValues[0]);
}

export function replaceLuckyHit(description, luckyHitValues) {
  if (!description.includes("{#}") || luckyHitValues.length === 0)
    return description;
  return description.replace("{#}", luckyHitValues[0]);
}

export function replaceValues(description, values, maxPoints) {
  let formattedDescription = description;

  // Handle multiple values arrays (values1, values2, etc.)
  Object.entries(values).forEach(([key, value]) => {
    let placeholder = `{#${key}}`;
    if (formattedDescription.includes(placeholder)) {
      formattedDescription = formattedDescription.replace(
        placeholder,
        `<span class="description-value">${value[maxPoints - 1]}</span>`
      );
    }
  });

  return formattedDescription;
}

// ========================== DETERMINE DMG TYPE
const cleanString = (str) => {
  return str.replace(/[^a-zA-Z]+/g, "").toLowerCase();
};

export const getDamageTypeInfoAndIcon = (tags) => {
  const hasFire = tags.some(
    (tag) =>
      cleanString(tag) === cleanString("Fire") ||
      cleanString(tag) === cleanString("Burn")
  );
  const hasFrost = tags.some(
    (tag) =>
      cleanString(tag) === cleanString("Frost") ||
      cleanString(tag) === cleanString("Cold")
  );
  const hasLightning = tags.some(
    (tag) =>
      cleanString(tag) === cleanString("Lightning") ||
      cleanString(tag) === cleanString("Shock")
  );
  const hasPoison = tags.some(
    (tag) => cleanString(tag) === cleanString("Poison")
  );
  const hasShadow = tags.some(
    (tag) => cleanString(tag) === cleanString("Shadow")
  );
  const hasPhysical = tags.some(
    (tag) => cleanString(tag) === cleanString("Physical")
  );

  let damageType = null;
  let tooltipIcon = null;

  if (hasFire) {
    damageType = "Fire damage";
    tooltipIcon = fireDmgIcon;
  } else if (hasFrost) {
    damageType = "Frost damage";
    tooltipIcon = coldDmgIcon;
  } else if (hasLightning) {
    damageType = "Lightning damage";
    tooltipIcon = lightningDmgIcon;
  } else if (hasPoison) {
    damageType = "Poison damage";
    tooltipIcon = poisonDmgIcon;
  } else if (hasShadow) {
    damageType = "Shadow damage";
    tooltipIcon = shadowDmgIcon;
  } else if (hasPhysical) {
    damageType = "Physical damage";
    tooltipIcon = physicalDmgIcon;
  }

  return { damageType, tooltipIcon };
};

// ========================== CLEAN SKILL RUNE NAME
export function cleanSkillRuneName(fullName, baseName) {
  if (fullName.endsWith(baseName)) {
    return fullName.slice(0, -baseName.length).trim();
  }
  return fullName;
}
