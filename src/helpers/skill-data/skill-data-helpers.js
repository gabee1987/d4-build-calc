export const getDescriptionParts = (nodeData, allocatedPoints) => {
  const hasPerSecond = nodeData.description.description.match(/( per second)/);

  const resourceType =
    nodeData.description.description.match(
      /(Fury|Essence|Spirit) Cost:/
    )?.[0] || "Mana Cost:";
  const resourceValue = nodeData.manaCostValues[0];

  const resourceCost = {
    type: resourceType,
    value: resourceValue,
    perSecond: hasPerSecond,
  };

  const cooldownValue =
    nodeData.manaCostValues.length === 0
      ? nodeData.luckyHitValues[0]
      : nodeData.manaCostValues[0];

  const cooldown = { value: cooldownValue };

  const luckyHitValue = nodeData.luckyHitValues[0];

  const luckyHit = { value: luckyHitValue };

  let description = nodeData.description.description;
  description = description.split("•").join("<br>•");

  const enchantmentIndex = description.indexOf("— Enchantment Effect —");

  if (enchantmentIndex === -1) {
    return { description, resourceCost, cooldown, luckyHit };
  } else {
    const preEnchantment = description.substring(0, enchantmentIndex);
    const enchantmentTitle = "— Enchantment Effect —";
    const enchantmentEffect = description.substring(
      enchantmentIndex + enchantmentTitle.length
    );

    return {
      preEnchantment,
      enchantmentTitle,
      enchantmentEffect,
      resourceCost,
      cooldown,
      luckyHit,
    };
  }
};

export const replaceDescriptionValues = (text, nodeData, allocatedPoints) => {
  return text.replace(
    /(\{#\w+\})|(\d+(\.\d+)?(%?))/g,
    (match, token, number) => {
      if (token) {
        const key = token.substring(2, token.length - 1);
        if (nodeData[key]) {
          const value =
            nodeData[key][allocatedPoints > 0 ? allocatedPoints - 1 : 0];
          return `${value}%`;
        }
      } else if (number) {
        return `${number}`;
      }
      return match;
    }
  );
};

export const cleanString = (str) => {
  return str.replace(/[^a-zA-Z]+/g, "").toLowerCase();
};

export const getDamageTypeInfo = (nodeData) => {
  const hasFire = nodeData.description.tags.some(
    (tag) =>
      cleanString(tag) === cleanString("Fire") ||
      cleanString(tag) === cleanString("Burn")
  );
  const hasFrost = nodeData.description.tags.some(
    (tag) =>
      cleanString(tag) === cleanString("Frost") ||
      cleanString(tag) === cleanString("Cold")
  );
  const hasLightning = nodeData.description.tags.some(
    (tag) =>
      cleanString(tag) === cleanString("Lightning") ||
      cleanString(tag) === cleanString("Shock")
  );
  const hasPoison = nodeData.description.tags.some(
    (tag) => cleanString(tag) === cleanString("Poison")
  );
  const hasShadow = nodeData.description.tags.some(
    (tag) => cleanString(tag) === cleanString("Shadow")
  );
  const hasPhysical = nodeData.description.tags.some(
    (tag) =>
      cleanString(tag) === cleanString("Physical") ||
      cleanString(tag) === cleanString("Bleed")
  );

  const damageType = {
    hasFire,
    hasFrost,
    hasLightning,
    hasPoison,
    hasShadow,
    hasPhysical,
  };

  return damageType;
};
