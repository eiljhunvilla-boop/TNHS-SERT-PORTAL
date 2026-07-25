import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

const announcementsRef = collection(db, "announcements");

// =============================
// REAL-TIME ANNOUNCEMENTS
// =============================

export function subscribeAnnouncements(callback) {
  return onSnapshot(announcementsRef, (snapshot) => {
    const announcements = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    announcements.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    callback(announcements);
  });
}

// =======================
// GET ALL ANNOUNCEMENTS
// =======================

export async function getAnnouncementsFirestore() {
  const snapshot = await getDocs(announcementsRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// =======================
// ADD ANNOUNCEMENT
// =======================

export async function addAnnouncementFirestore(
  announcement
) {
  const announcementDoc = doc(
    db,
    "announcements",
    announcement.id.toString()
  );

  await setDoc(
    announcementDoc,
    announcement
  );
}

// =======================
// DELETE ANNOUNCEMENT
// =======================

export async function deleteAnnouncementFirestore(id) {
  await deleteDoc(
    doc(db, "announcements", id.toString())
  );
}