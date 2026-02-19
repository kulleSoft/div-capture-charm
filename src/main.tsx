import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const applySystemTheme = () => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
applySystemTheme();
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applySystemTheme);

createRoot(document.getElementById("root")!).render(<App />);
