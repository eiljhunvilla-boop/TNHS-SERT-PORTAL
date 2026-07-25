import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardLayout from "../components/ui/layout/DashboardLayout";
import AnnouncementCard from "../components/ui/announcements/AnnouncementCard";

import {
  subscribeAnnouncements,
} from "../services/announcementService";

export default function Announcements() {
  const member = JSON.parse(localStorage.getItem("sertMember"));

  if (!member) {
    return <Navigate to="/" replace />;
  }

  const [announcementList, setAnnouncementList] = useState([]);

  // =============================
  // REAL-TIME ANNOUNCEMENTS
  // =============================

  useEffect(() => {
    const unsubscribe = subscribeAnnouncements((data) => {
      setAnnouncementList(data);
    });

    return () => unsubscribe();
  }, []);

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

          {announcementList.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-white/10 bg-[#182234]/60 p-10 text-center">

              <h2 className="text-2xl font-semibold text-white">
                No announcements yet
              </h2>

              <p className="mt-3 text-gray-400">
                New announcements from the Admin Portal will appear here.
              </p>

            </div>

          ) : (

            announcementList.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))

          )}

        </div>

      </div>
    </DashboardLayout>
  );
}