import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./index.css";

// Google Analytics
import ReactGA from "react-ga4";

const root = ReactDOM.createRoot(document.getElementById("root"));

//Initialize GA4
ReactGA.initialize("G-4PXQ0M8SVF");

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

const SendAnalytics = () => {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
  });
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(SendAnalytics);
