import loadSpellImages from "./spell-images";

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

    spellImagesMap[spellName] = path;
  });

  return spellImagesMap;
};

export default createSpellImagesMap;
