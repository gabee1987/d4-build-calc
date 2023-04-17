import React, { createContext, useState, useEffect } from "react";

const SkillTreeContext = createContext();

const SkillTreeProvider = ({ children }) => {
  const [skillTreeState, setSkillTreeState] = useState(null);
  const [skillTreeData, setSkillTreeData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/path/to/skill-tree/data.json");
      const data = await response.json();
      setSkillTreeData(data);
    }

    fetchData();
  }, []);

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
    <SkillTreeContext.Provider
      value={{
        skillTreeState,
        setSkillTreeState,
        skillTreeData,
        setSkillTreeData,
      }}
    >
      {children}
    </SkillTreeContext.Provider>
  );
};

export { SkillTreeContext, SkillTreeProvider };
