import React from "react";
import { Link } from "react-router-dom";

import "./footer.styles.scss";

const Footer = () => {
  return (
    <div className="footer">
      <span className="app-copyright-info">
        Diablo 4 Build Calculator © 2023
      </span>
      <span className="blizzard-assets-info">
        Diablo 4 assets © Blizzard Entertainment. All rights reserved.
      </span>
      <span className="affiliates-info">
        This website is not affiliated with or endorsed by Blizzard
        Entertainment. The use of Diablo 4 assets is for educational and
        entertainment purposes only.
      </span>
      <span className="official-d4-link">
        For more information about Diablo 4, please visit the
        <a href="https://diablo4.blizzard.com/">official website</a>
      </span>
    </div>
  );
};

export default Footer;
