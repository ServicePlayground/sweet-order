import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/apps/web-seller/App.tsx";
import "@/apps/web-seller/common/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
