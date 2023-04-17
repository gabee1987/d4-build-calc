import React, { createContext, useState, useEffect } from "react";

const SkillTreeContext = createContext();

const SkillTreeProvider = ({ children }) => {
  const [skillTreeState, setSkillTreeState] = useState(null);

  useEffect(() => {
    // Fetch initial state from localStorage
    const savedState = localStorage.getItem("skillTreeState");
    if (savedState) {
      setSkillTreeState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    if (skillTreeState) {
      // Update localStorage when skillTreeState changes
      localStorage.setItem("skillTreeState", JSON.stringify(skillTreeState));
    }
  }, [skillTreeState]);

  return (
    <SkillTreeContext.Provider value={{ skillTreeState, setSkillTreeState }}>
      {children}
    </SkillTreeContext.Provider>
  );
};

export { SkillTreeContext, SkillTreeProvider };
