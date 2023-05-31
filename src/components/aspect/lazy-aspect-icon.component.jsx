import React, { useEffect, useState } from "react";
import { loadAspectIcons } from "../../helpers/codex/aspects-loader";

const LazyAspectIcon = ({ category }) => {
  const [aspectIcon, setAspectIcon] = useState(null);

  useEffect(() => {
    loadAspectIcons(category)
      .then((icon) => {
        setAspectIcon(icon);
      })
      .catch((error) => {
        console.error("Failed to load aspect icon:", error);
      });
  }, [category]);

  if (!aspectIcon) {
    return null; // Return null or a placeholder component if the icon is still loading
  }

  return <img className="aspect-icon" src={aspectIcon} alt="aspect-icon" />;
};

export default LazyAspectIcon;
