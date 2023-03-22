import { Routes, Route } from "react-router-dom"; // Have to run "yarn add react-router-dom" if not found

//fonts
import "./fonts/OldFenris.ttf";
import "./fonts/DIABLO_H.TTF";
import "./fonts/TSGRomulus-Bold.ttf";

// Components
import ClassMenu from "./components/class-menu/class-menu.component.jsx";
import TalentTreePage from "./components/talent-tree-page/talent-tree-page.component.jsx";

import "./App.scss";

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigation />}> */}
      <Route index element={<ClassMenu />} />
      <Route path="/talent-tree/:className" element={<TalentTreePage />} />
      {/* </Route> */}
    </Routes>
  );
};

export default App;
