import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../adhd-command-center.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
