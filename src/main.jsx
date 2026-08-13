import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import { AnnouncementContext } from "./context/AnnouncementContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>

    <AnnouncementContext.Provider
      value={{
        announcementList: [],
        readAnnouncements: [],
        unreadCount: 0,
        markAsRead: () => {},
        markAsUnread: () => {},
      }}
    >
      <App />
    </AnnouncementContext.Provider>

  </BrowserRouter>
);