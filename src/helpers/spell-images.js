function loadSpellImages(className) {
  console.log("loading " + className + " images...");

  let imagesContext;

  switch (className) {
    case "sorcerer":
      imagesContext = require.context(
        "../assets/spell-images/sorcerer",
        true,
        /\.(png|jpe?g|gif)$/i
      );
      console.log(imagesContext);
      break;

    case "barbarian":
      imagesContext = require.context(
        "../assets/spell-images/barbarian",
        true,
        /\.(png|jpe?g|gif)$/i
      );
      break;

    // Add other cases for other classes...
    default:
      throw new Error("Unknown class name: " + className);
  }

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
