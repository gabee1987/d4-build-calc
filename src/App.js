import { Routes, Route } from "react-router-dom"; // Have to run "yarn add react-router-dom" if not found

//fonts
import "./fonts/OldFenris.ttf";
import "./fonts/DIABLO_H.TTF";
import "./fonts/TSGRomulus-Bold.ttf";

// Components
import ClassMenu from "./components/class-menu/class-menu.component.jsx";
import SkillCalculator from "./components/skill-calculator/skill-calculator.component.jsx";
import IndexPage from "./components/index-page/index-page.component";
import Footer from "./components/footer/footer.component";

import "./App.scss";

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigation />}> */}
      <Route index element={<IndexPage />} />
      <Route path="/class-menu" element={<ClassMenu />} />
      {/* <Route element={<Footer />}></Route> */}
      <Route path="/skill-tree/:className" element={<SkillCalculator />} />
      {/* </Route> */}
    </Routes>
  );
};

export default App;
