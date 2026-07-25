import { useEffect, useState } from "react";

import {
  subscribeAnnouncements,
} from "../../../services/announcementService";

export default function AnnouncementCard() {

const [announcementList, setAnnouncementList] = useState([]);

useEffect(() => {
  const unsubscribe = subscribeAnnouncements((data) => {
    setAnnouncementList(data);
  });

  return () => unsubscribe();
}, []);

  const latestAnnouncements = [...announcementList]
    .sort((a, b) => {

      // Show pinned announcements first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Then newest announcements
      return new Date(b.createdAt) - new Date(a.createdAt);

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

          latestAnnouncements.map((announcement) => (

            <div
              key={announcement.id}
              className="rounded-xl bg-[#101B2E] p-4"
            >

              <div className="flex items-center justify-between">

                <h3 className="font-semibold text-white">
                  📢 {announcement.title}
                </h3>

                {announcement.pinned && (
                  <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-black">
                    PINNED
                  </span>
                )}

              </div>

              <p className="mt-2 text-sm text-gray-300">
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

            </div>

          ))

        )}

      </div>

    </div>

  );

}