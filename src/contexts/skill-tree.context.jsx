import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { parseSkillTreeUrl } from "../helpers/skill-tree/state-management-utils";

const SkillTreeContext = React.createContext({
  skillTreeState: {},
  setSkillTreeState: () => {},
});

export const SkillTreeProvider = ({ children }) => {
  const location = useLocation();
  const initialSkillTreeState = useMemo(() => {
    const { pathname } = location;
    if (pathname && pathname.startsWith("/skill-tree/")) {
      const { classname, skillTreeState: decodedState } = parseSkillTreeUrl(
        window.location.href
      );
      if (decodedState[classname]) {
        return { ...decodedState };
      }
    }
    return {};
  }, [location]);

  const [skillTreeState, setSkillTreeState] = useState(initialSkillTreeState);

  return (
    <SkillTreeContext.Provider value={{ skillTreeState, setSkillTreeState }}>
      {children}
    </SkillTreeContext.Provider>
  );
};

export default SkillTreeContext;
