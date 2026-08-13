import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Training from "./pages/Training";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MigrateMembers from "./pages/MigrateMembers";

import {
  AnnouncementContext,
} from "./context/AnnouncementContext";

import { useEffect, useState } from "react";

import {
  subscribeAnnouncements,
} from "./services/announcementService";

function AnnouncementProvider({ children }) {

  const [announcementList, setAnnouncementList] = useState([]);

  const [readAnnouncements, setReadAnnouncements] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("readAnnouncements") || "[]"
      );
    } catch {
      return [];
    }
  });

  // =================================
  // REAL-TIME FIRESTORE ANNOUNCEMENTS
  // =================================

  useEffect(() => {

    const unsubscribe =
      subscribeAnnouncements((data) => {
        setAnnouncementList(data);
      });

    return () => unsubscribe();

  }, []);

  // =================================
  // SAVE READ STATE
  // =================================

  useEffect(() => {

    localStorage.setItem(
      "readAnnouncements",
      JSON.stringify(readAnnouncements)
    );

  }, [readAnnouncements]);

  // =================================
  // MARK AS READ
  // =================================

  const markAsRead = (id) => {

    setReadAnnouncements((current) => {

      if (current.includes(id)) {
        return current;
      }

      return [...current, id];

    });

  };

  // =================================
  // MARK AS UNREAD
  // =================================

  const markAsUnread = (id) => {

    setReadAnnouncements((current) =>
      current.filter(
        (announcementId) =>
          announcementId !== id
      )
    );

  };

  // =================================
  // UNREAD COUNT
  // =================================

  const unreadCount =
    announcementList.filter(
      (announcement) =>
        !readAnnouncements.includes(
          announcement.id
        )
    ).length;

  const value = {
    announcementList,
    readAnnouncements,
    unreadCount,
    markAsRead,
    markAsUnread,
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
}


function App() {

  return (

    <AnnouncementProvider>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/training"
          element={<Training />}
        />

        <Route
          path="/announcements"
          element={<Announcements />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/migrate"
          element={<MigrateMembers />}
        />

      </Routes>

    </AnnouncementProvider>

  );
}

export default App;