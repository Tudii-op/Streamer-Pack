import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './App.css';

// expose for plugins
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
