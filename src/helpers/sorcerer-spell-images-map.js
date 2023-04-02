import loadSpellImages from "./spell-images";

const sorcererImages = loadSpellImages("sorcerer");
// console.log("sorcererImages", sorcererImages);

const createSpellImagesMap = () => {
  const spellImagesMap = {};

  sorcererImages.forEach(({ name, path }) => {
    const spellName = name
      .split("/")
      .pop()
      .split("__")[0]
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    spellImagesMap[spellName] = path;
  });

  return spellImagesMap;
};

const sorcererSpellImagesMap = createSpellImagesMap();

export default sorcererSpellImagesMap;
