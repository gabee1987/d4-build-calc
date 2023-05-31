import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { generateJsonLdData } from "./data/json-ld-generator";

//fonts

// Contexts
import ClassSelectionContext from "./contexts/class-selection.context";

// Components
import IndexPage from "./components/index-page/index-page.component";
import ClassMenu from "./components/class-menu/class-menu.component.jsx";
import SkillCalculator from "./components/skill-calculator/skill-calculator.component.jsx";
import Footer from "./components/footer/footer.component";
import ClassSkillsComponent from "./components/class-skills/class-skills.component";
import AspectsComponent from "./components/aspects/aspects.component";

import "./App.scss";

const App = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  // Generating the Json LD
  const jsonLdData = generateJsonLdData();
  const jsonLdScript = document.getElementById("json-ld-data");
  jsonLdScript.innerText = JSON.stringify(jsonLdData);

  return (
    <ClassSelectionContext.Provider value={{ selectedClass, setSelectedClass }}>
      <Routes>
        <Route index path="/" element={<IndexPage />} />
        <Route path="/class-menu" element={<ClassMenu />} />
        <Route element={<Footer />}></Route>
        <Route
          path="/skill-tree/:className/:allocatedPoints?"
          element={<SkillCalculator />}
        />
        <Route path="/codex/class-skills/" element={<ClassSkillsComponent />} />
        <Route path="/codex/aspects/" element={<AspectsComponent />} />
      </Routes>
    </ClassSelectionContext.Provider>
  );
};

export default App;
