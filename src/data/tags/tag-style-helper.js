import TagType from "./tag-types";
import Tags from "./tags";

export const getTagClass = (Tag) => {
  let tag = Tag.replace(/[^\w\s]+/g, "");
  let className = "";

  // Iterate through the Tags object and find the corresponding tag object by name
  for (const tagKey in Tags) {
    if (Tags[tagKey].name === tag) {
      // Get the type and className for the found tag
      let type = Tags[tagKey].type;
      let tagClassName = Tags[tagKey].className;

      // Find the corresponding key in TagType by comparing the type value
      let tagTypeClassName = Object.keys(TagType).find(
        (key) => TagType[key] === type
      );

      // If tagTypeClassName is found, convert it to lowercase
      if (tagTypeClassName) {
        tagTypeClassName = tagTypeClassName.toLowerCase();
      }

      // Use the lowercase tag type with the '-' sign
      className = `${type} ${tagClassName}`;
      break;
    }
  }

  return className;
};
