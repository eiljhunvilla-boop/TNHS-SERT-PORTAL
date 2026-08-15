import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

import {
  subscribeAnnouncements,
} from "./services/announcementService";


// ==========================================
// GET SAVED MEMBER
// ==========================================

function getSavedMember() {
  try {
    const saved = localStorage.getItem("sertMember");

    if (!saved) {
      return null;
    }

    return JSON.parse(saved);

  } catch (error) {

    console.error(
      "Error reading saved member:",
      error
    );

    localStorage.removeItem("sertMember");

    return null;
  }
}


// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({ children }) {

  const member = getSavedMember();

  if (!member) {
    return <Navigate to="/" replace />;
  }

  return children;
}


// ==========================================
// LOGIN ROUTE
// ==========================================

function LoginRoute() {

  const member = getSavedMember();

  // Already logged in
  if (member) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}


// ==========================================
// ANNOUNCEMENT PROVIDER
// ==========================================

function AnnouncementProvider({ children }) {

  const [announcementList, setAnnouncementList] =
    useState([]);

  const [readAnnouncements, setReadAnnouncements] =
    useState(() => {

      try {

        return JSON.parse(
          localStorage.getItem(
            "readAnnouncements"
          ) || "[]"
        );

      } catch {

        return [];

      }

    });


  // ==========================================
  // FIRESTORE ANNOUNCEMENTS
  // ==========================================

  useEffect(() => {

    const unsubscribe =
      subscribeAnnouncements((data) => {

        setAnnouncementList(data);

      });

    return () => {

      if (typeof unsubscribe === "function") {
        unsubscribe();
      }

    };

  }, []);


  // ==========================================
  // SAVE READ STATE
  // ==========================================

  useEffect(() => {

    localStorage.setItem(
      "readAnnouncements",
      JSON.stringify(
        readAnnouncements
      )
    );

  }, [readAnnouncements]);


  // ==========================================
  // MARK AS READ
  // ==========================================

  function markAsRead(id) {

    setReadAnnouncements((current) => {

      if (current.includes(id)) {
        return current;
      }

      return [
        ...current,
        id,
      ];

    });

  }


  // ==========================================
  // MARK AS UNREAD
  // ==========================================

  function markAsUnread(id) {

    setReadAnnouncements((current) => {

      return current.filter(
        (announcementId) =>
          announcementId !== id
      );

    });

  }


  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount =
    announcementList.filter(
      (announcement) =>
        !readAnnouncements.includes(
          announcement.id
        )
    ).length;


  // ==========================================
  // CONTEXT
  // ==========================================

  const value = {

    announcementList,

    readAnnouncements,

    unreadCount,

    markAsRead,

    markAsUnread,

  };


  return (

    <AnnouncementContext.Provider
      value={value}
    >

      {children}

    </AnnouncementContext.Provider>

  );

}


// ==========================================
// APP
// ==========================================

function App() {

  return (

    <AnnouncementProvider>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={
            <LoginRoute />
          }
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />


        {/* TRAINING */}

        <Route
          path="/training"
          element={
            <ProtectedRoute>
              <Training />
            </ProtectedRoute>
          }
        />


        {/* ANNOUNCEMENTS */}

        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          }
        />


        {/* PROFILE */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* SETTINGS */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />


        {/* MIGRATE */}

        <Route
          path="/migrate"
          element={
            <ProtectedRoute>
              <MigrateMembers />
            </ProtectedRoute>
          }
        />


        {/* UNKNOWN URL */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </AnnouncementProvider>

  );

}

export default App;