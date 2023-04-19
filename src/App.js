import { Routes, Route } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";

//fonts
import "./fonts/OldFenris.ttf";
import "./fonts/DIABLO_H.TTF";
import "./fonts/TSGRomulus-Bold.ttf";

// Contexts
import ClassSelectionContext from "./contexts/class-selection.context";
import SkillTreeContext from "./contexts/skill-tree.context";

// Components
import ClassMenu from "./components/class-menu/class-menu.component.jsx";
import SkillCalculator from "./components/skill-calculator/skill-calculator.component.jsx";
import IndexPage from "./components/index-page/index-page.component";
import Footer from "./components/footer/footer.component";

import "./App.scss";

const App = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [skillTreeState, setSkillTreeState] = useState({});

  return (
    <ClassSelectionContext.Provider value={{ selectedClass, setSelectedClass }}>
      <SkillTreeContext.Provider value={{ skillTreeState, setSkillTreeState }}>
        <Routes>
          <Route index element={<IndexPage />} />
          <Route path="/class-menu" element={<ClassMenu />} />
          <Route element={<Footer />}></Route>
          <Route path="/skill-tree/:className" element={<SkillCalculator />} />
        </Routes>
      </SkillTreeContext.Provider>
    </ClassSelectionContext.Provider>
  );
};

export default App;
