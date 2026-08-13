import { useEffect, useState } from "react";

import {
  subscribeAnnouncements,
} from "../../../services/announcementService";

export default function AnnouncementCard() {
  const [announcementList, setAnnouncementList] = useState([]);

  // Temporary local read/unread tracking
  const [readAnnouncements, setReadAnnouncements] = useState(() => {
    const saved = localStorage.getItem("readAnnouncements");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const unsubscribe = subscribeAnnouncements((data) => {
      setAnnouncementList(data);
    });

    return () => unsubscribe();
  }, []);

  // =============================
  // MARK AS READ
  // =============================

  function markAsRead(id) {
    const updated = [...readAnnouncements, id];

    setReadAnnouncements(updated);

    localStorage.setItem(
      "readAnnouncements",
      JSON.stringify(updated)
    );

    window.dispatchEvent(new Event("announcementsUpdated"));
  }

  // =============================
  // MARK AS UNREAD
  // =============================

  function markAsUnread(id) {
    const updated = readAnnouncements.filter(
      (announcementId) => announcementId !== id
    );

    setReadAnnouncements(updated);

    localStorage.setItem(
      "readAnnouncements",
      JSON.stringify(updated)
    );

    window.dispatchEvent(new Event("announcementsUpdated"));
  }

  // =============================
  // SORT ANNOUNCEMENTS
  // UNREAD FIRST
  // =============================

  const latestAnnouncements = [...announcementList]
    .sort((a, b) => {
      const aRead = readAnnouncements.includes(a.id);
      const bRead = readAnnouncements.includes(b.id);

      // Unread announcements first
      if (aRead && !bRead) return 1;
      if (!aRead && bRead) return -1;

      // Pinned announcements
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Newest first
      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    })
    .slice(0, 3);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#182234]/70 p-6 backdrop-blur-xl">

      <h2 className="mb-5 text-xl font-bold text-white">
        Latest Announcements
      </h2>

      <div className="space-y-4">

        {latestAnnouncements.length === 0 ? (

          <div className="rounded-xl bg-[#101B2E] p-4 text-center text-gray-400">
            No announcements available.
          </div>

        ) : (

          latestAnnouncements.map((announcement) => {

            const isRead =
              readAnnouncements.includes(
                announcement.id
              );

            return (
              <div
                key={announcement.id}
                className={`rounded-xl p-4 transition-all duration-300 ${
                  isRead
                    ? "bg-[#0B1527] opacity-60"
                    : "bg-[#101B2E] border border-blue-500/20"
                }`}
              >

                <div className="flex items-center justify-between gap-3">

                  <h3
                    className={`font-semibold ${
                      isRead
                        ? "text-gray-400"
                        : "text-white"
                    }`}
                  >
                    📢 {announcement.title}
                  </h3>

                  <div className="flex items-center gap-2">

                    {announcement.pinned && (
                      <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-black">
                        PINNED
                      </span>
                    )}

                  </div>

                </div>

                <p
                  className={`mt-2 text-sm ${
                    isRead
                      ? "text-gray-500"
                      : "text-gray-300"
                  }`}
                >
                  {announcement.message}
                </p>

                <p className="mt-3 text-xs text-gray-500">
                  {announcement.author} •{" "}
                  {announcement.createdAt
                    ? new Date(
                        announcement.createdAt
                      ).toLocaleDateString()
                    : ""}
                </p>

                {/* READ / UNREAD BUTTON */}

                <div className="mt-4 flex justify-end">

                  {isRead ? (

                    <button
                      onClick={() =>
                        markAsUnread(
                          announcement.id
                        )
                      }
                      className="rounded-lg bg-blue-600/20 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:bg-blue-600/30"
                    >
                      ↩ Mark as Unread
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        markAsRead(
                          announcement.id
                        )
                      }
                      className="rounded-lg bg-green-600/20 px-3 py-2 text-xs font-semibold text-green-300 transition hover:bg-green-600/30"
                    >
                      ✓ Mark as Read
                    </button>

                  )}

                </div>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
}