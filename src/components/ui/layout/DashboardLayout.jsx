import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import BottomNav from "../dashboard/BottomNav";

import {
  subscribeAnnouncements,
} from "../../../services/announcementService";

import {
  AnnouncementContext,
} from "../../../context/AnnouncementContext";

export default function DashboardLayout({ children }) {
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
  // REAL-TIME ANNOUNCEMENTS
  // =================================

  useEffect(() => {
    const unsubscribe = subscribeAnnouncements((data) => {
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

  const unreadCount = announcementList.filter(
    (announcement) =>
      !readAnnouncements.includes(announcement.id)
  ).length;

  // =================================
  // SHARED CONTEXT VALUE
  // =================================

  const announcementContextValue = {
    announcementList,
    readAnnouncements,
    unreadCount,
    markAsRead,
    markAsUnread,
  };

  return (
    <AnnouncementContext.Provider
      value={announcementContextValue}
    >

      <div className="min-h-screen bg-gradient-to-br from-[#08111F] via-[#0B1527] to-[#111827]">

        <div className="flex">

          <div className="hidden lg:block">
            <Sidebar unreadCount={unreadCount} />
          </div>

          <main className="flex-1 p-8 pb-24">
            {children}
          </main>

        </div>

        <BottomNav />

      </div>

    </AnnouncementContext.Provider>
  );
}