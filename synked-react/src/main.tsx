import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import "./firebase";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
