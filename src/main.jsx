import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

async function registerFirebaseMessagingSW() {
  if ("serviceWorker" in navigator) {
    try {
      const registration =
        await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

      console.log(
        "Firebase Messaging Service Worker registered:",
        registration
      );
    } catch (error) {
      console.error(
        "Firebase Messaging Service Worker registration failed:",
        error
      );
    }
  }
}

registerFirebaseMessagingSW();

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);