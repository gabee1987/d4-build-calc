import React from "react";

const ClassSelectionContext = React.createContext({
  selectedClass: null,
  setSelectedClass: () => {},
});

export default ClassSelectionContext;
