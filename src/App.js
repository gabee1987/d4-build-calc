import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { logPageView } from "./analytics";

//fonts

// Contexts
import ClassSelectionContext from "./contexts/class-selection.context";

// Components
import ClassMenu from "./components/class-menu/class-menu.component.jsx";
import ClassOverviewComponent from "./components/class-overview/class-overview.component.jsx";
import SkillCalculator from "./components/skill-calculator/skill-calculator.component.jsx";
import IndexPage from "./components/index-page/index-page.component";
import Footer from "./components/footer/footer.component";

import "./App.scss";

const App = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  // Google Analytics
  const location = useLocation();
  useEffect(() => {
    logPageView();
  }, [location]);

  return (
    <ClassSelectionContext.Provider value={{ selectedClass, setSelectedClass }}>
      <Routes>
        <Route index path="/" element={<IndexPage />} />
        <Route path="/class-menu" element={<ClassMenu />} />
        <Route
          path="/class-info/:className"
          element={<ClassOverviewComponent />}
        />
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
