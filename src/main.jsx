import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { DarkModeProvider } from "./context/DarkModeContext";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <DarkModeProvider>
    <NotificationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NotificationProvider>
  </DarkModeProvider>
);