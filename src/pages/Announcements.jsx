import { Navigate } from "react-router-dom";

import DashboardLayout from "../components/ui/layout/DashboardLayout";

import {
  useAnnouncements,
} from "../context/AnnouncementContext";

export default function Announcements() {
  const member = JSON.parse(
    localStorage.getItem("sertMember")
  );

  if (!member) {
    return <Navigate to="/" replace />;
  }

  const {
    announcementList,
    readAnnouncements,
    markAsRead,
    markAsUnread,
  } = useAnnouncements();

  // =================================
  // SORT ANNOUNCEMENTS
  // UNREAD FIRST
  // =================================

  const sortedAnnouncements = [...announcementList].sort(
    (a, b) => {
      const aRead = readAnnouncements.includes(a.id);
      const bRead = readAnnouncements.includes(b.id);

      // Unread first
      if (aRead && !bRead) return 1;
      if (!aRead && bRead) return -1;

      // Pinned first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Newest first
      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    }
  );

  return (
    <DashboardLayout>

      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold text-white">
          Announcements
        </h1>

        <p className="mt-2 text-gray-400">
          Stay updated with the latest TNHS SERT announcements.
        </p>

        <div className="mt-8 grid gap-5">

          {sortedAnnouncements.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-white/10 bg-[#182234]/60 p-10 text-center">

              <h2 className="text-2xl font-semibold text-white">
                No announcements yet
              </h2>

              <p className="mt-3 text-gray-400">
                New announcements from the Admin Portal will appear here.
              </p>

            </div>

          ) : (

            sortedAnnouncements.map((announcement) => {

              const isRead =
                readAnnouncements.includes(
                  announcement.id
                );

              return (

                <div
                  key={announcement.id}
                  className={`rounded-2xl border p-6 transition-all duration-300 ${
                    isRead
                      ? "border-white/5 bg-[#0B1527] opacity-60"
                      : "border-blue-500/20 bg-[#182234]"
                  }`}
                >

                  {/* HEADER */}

                  <div className="flex items-center justify-between gap-4">

                    <h2
                      className={`text-xl font-bold ${
                        isRead
                          ? "text-gray-400"
                          : "text-white"
                      }`}
                    >
                      📢 {announcement.title}
                    </h2>

                    {announcement.pinned && (

                      <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-black">
                        PINNED
                      </span>

                    )}

                  </div>

                  {/* MESSAGE */}

                  <p
                    className={`mt-4 leading-relaxed ${
                      isRead
                        ? "text-gray-500"
                        : "text-gray-300"
                    }`}
                  >
                    {announcement.message}
                  </p>

                  {/* META */}

                  <p className="mt-5 text-sm text-gray-500">

                    {announcement.author}

                    {" • "}

                    {announcement.createdAt
                      ? new Date(
                          announcement.createdAt
                        ).toLocaleDateString()
                      : ""}

                  </p>

                  {/* READ / UNREAD */}

                  <div className="mt-5 flex justify-end">

                    {isRead ? (

                      <button
                        onClick={() =>
                          markAsUnread(
                            announcement.id
                          )
                        }
                        className="rounded-xl bg-blue-600/20 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-600/30"
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
                        className="rounded-xl bg-green-600/20 px-4 py-2 text-sm font-semibold text-green-300 transition hover:bg-green-600/30"
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

    </DashboardLayout>
  );
}