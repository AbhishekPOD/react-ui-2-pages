import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import init from "calc_wasm";
import "./index.css";
import App from "./App.jsx";

init();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
