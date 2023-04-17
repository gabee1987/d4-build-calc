import loadSpellImages from "./spell-images";

function normalizeSpellName(name) {
  // Remove special characters, like apostrophes
  const noSpecialChars = name.replace(/[^\w\s]/gi, "");

  // Replace spaces with underscores and convert to lowercase
  const normalized = noSpecialChars.replace(/\s+/g, "_").toLowerCase();

  // Append the double underscore
  const withDoubleUnderscore = normalized + "__";

  return withDoubleUnderscore;
}

const createSpellImagesMap = (className) => {
  const classImages = loadSpellImages(className);
  const spellImagesMap = {};

  classImages.forEach(({ name, path }) => {
    const spellName = name
      .split("/")
      .pop()
      .split("__")[0]
      .split("_")
      .join(" ")
      .toLowerCase();

    const normalizedSpellName = normalizeSpellName(spellName);
    spellImagesMap[normalizedSpellName] = path;
  });

  //console.log("Spell images map for " + className + ": ", spellImagesMap);

  return spellImagesMap;
};

export default createSpellImagesMap;
