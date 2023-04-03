import loadSpellImages from "./spell-images";

const sorcererImages = loadSpellImages("sorcerer");
// console.log("sorcererImages", sorcererImages);

const createSpellImagesMap = () => {
  const spellImagesMap = {};

  sorcererImages.forEach(({ name, path }) => {
    // console.log("name: " + name);
    const spellName = name
      .split("/")
      .pop()
      .split("__")[0]
      .split("_")
      .join(" ")
      .toLowerCase();

    spellImagesMap[spellName] = path;
    // console.log("spellName: " + spellName);
    // console.log(spellImagesMap[spellName]);
  });

  return spellImagesMap;
};

const sorcererSpellImagesMap = createSpellImagesMap();

export default sorcererSpellImagesMap;
