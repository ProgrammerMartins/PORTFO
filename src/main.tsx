import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { applyTheme } from "./lib/useSiteTheme";

// Apply theme synchronously before first paint to avoid a flash.
const saved = localStorage.getItem("martins.site-theme");
applyTheme(saved === "light" ? "light" : "dark");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
