import { Routes, Route, Router } from "react-router-dom";
import React, { useState } from "react";

//fonts
import "./fonts/OldFenris.ttf";
import "./fonts/DIABLO_H.TTF";
import "./fonts/TSGRomulus-Bold.ttf";

// Contexts
import ClassSelectionContext from "./contexts/class-selection.context";

// Components
import ClassMenu from "./components/class-menu/class-menu.component.jsx";
import SkillCalculator from "./components/skill-calculator/skill-calculator.component.jsx";
import IndexPage from "./components/index-page/index-page.component";
import Footer from "./components/footer/footer.component";

import "./App.scss";

const App = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <ClassSelectionContext.Provider value={{ selectedClass, setSelectedClass }}>
      <Routes basename={process.env.REACT_APP_URI}>
        <Route index element={<IndexPage />} />
        <Route path="/class-menu" element={<ClassMenu />} />
        <Route element={<Footer />}></Route>
        <Route
          path="/skill-tree/:className/:allocatedPoints?"
          element={<SkillCalculator />}
        />
      </Routes>
    </ClassSelectionContext.Provider>
  );
};

export default App;
