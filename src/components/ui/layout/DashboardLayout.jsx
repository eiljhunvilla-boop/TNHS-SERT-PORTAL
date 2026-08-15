import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import BottomNav from "../dashboard/BottomNav";

import {
  subscribeAnnouncements,
} from "../../../services/announcementService";

import {
  showAnnouncementNotification,
  listenForForegroundMessages,
} from "../../../services/notificationService";

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
  // FIREBASE FCM FOREGROUND LISTENER
  // =================================

  useEffect(() => {
    console.log(
      "Starting SERT Portal FCM foreground listener..."
    );

    const unsubscribe =
      listenForForegroundMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // =================================
  // REAL-TIME FIRESTORE ANNOUNCEMENTS
  // =================================

  useEffect(() => {
    let firstLoad = true;
    let previousAnnouncementIds = new Set();

    const unsubscribe =
      subscribeAnnouncements((data) => {

        // Don't notify for announcements that
        // already existed when the member
        // first opened the portal.

        if (firstLoad) {

          previousAnnouncementIds =
            new Set(
              data.map(
                (announcement) =>
                  announcement.id
              )
            );

          firstLoad = false;

        } else {

          const newAnnouncements =
            data.filter(
              (announcement) =>
                !previousAnnouncementIds.has(
                  announcement.id
                )
            );

          newAnnouncements.forEach(
            (announcement) => {
              showAnnouncementNotification(
                announcement
              );
            }
          );

          previousAnnouncementIds =
            new Set(
              data.map(
                (announcement) =>
                  announcement.id
              )
            );
        }

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

      return [
        ...current,
        id,
      ];

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
            <Sidebar
              unreadCount={unreadCount}
            />
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