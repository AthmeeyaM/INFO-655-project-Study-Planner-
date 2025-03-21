import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { DarkModeProvider } from "./context/DarkModeContext";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <DarkModeProvider>
    <NotificationProvider>
      <BrowserRouter basename="/INFO-655-project-Study-Planner-/">
        <App />
      </BrowserRouter>
    </NotificationProvider>
  </DarkModeProvider>
);