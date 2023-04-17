function loadSpellImages(className) {
  console.log("loading " + className + " images...");

  let imagesContext;

  switch (className) {
    case "barbarian":
      imagesContext = require.context(
        "../../assets/spell-images/barbarian",
        true,
        /\.(webp)$/i
      );
      break;

    case "necromancer":
      imagesContext = require.context(
        "../../assets/spell-images/necromancer",
        true,
        /\.(webp)$/i
      );
      break;

    case "sorcerer":
      imagesContext = require.context(
        "../../assets/spell-images/sorcerer",
        true,
        /\.(webp)$/i
      );
      console.log(imagesContext);
      break;

    case "rogue":
      imagesContext = require.context(
        "../../assets/spell-images/rogue",
        true,
        /\.(webp)$/i
      );
      break;

    case "druid":
      imagesContext = require.context(
        "../../assets/spell-images/druid",
        true,
        /\.(webp)$/i
      );
      break;

    // Add other cases for other classes...
    default:
      throw new Error("Unknown class name: " + className);
  }

  const images = imagesContext.keys().map((key) => ({
    name: key,
    path: imagesContext(key).default,
  }));
  console.log("Loaded images for " + className + ": ", images); // Add this log

  return imagesContext.keys().map((key) => {
    const module = imagesContext(key);
    // console.log("key: " + key);
    return {
      name: key,
      path: module.default || module,
    };
  });
}

export default loadSpellImages;
