import aspectsData from "../../data/aspects/aspects-data.json";

export const loadAspects = () => {
  return aspectsData;
};

export const loadAspectIcons = (category) => {
  let iconFileName;
  switch (category) {
    case "defensive":
      iconFileName = "aspect-defensive.webp";
      break;
    case "mobility":
      iconFileName = "aspect-mobility.webp";
      break;
    case "offensive":
      iconFileName = "aspect-offensive.webp";
      break;
    case "resource":
      iconFileName = "aspect-resource.webp";
      break;
    case "utility":
      iconFileName = "aspect-utility.webp";
      break;
    default:
      // TODO Handle default case
      break;
  }

  // Load the aspect icon file dynamically
  if (iconFileName) {
    return import(`../../assets/icons/${iconFileName}`).then(
      (icon) => icon.default
    );
  }

  return Promise.reject(new Error(`Invalid aspect category: ${category}`));
};
