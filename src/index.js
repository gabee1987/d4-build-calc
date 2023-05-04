import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Handle the redirect from 404.html
const basename = (() => {
  const { pathname } = window.location;
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect.startsWith(pathname)) {
    return redirect.slice(0, pathname.length);
  }
  return "/";
})();

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
