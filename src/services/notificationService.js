import { getToken } from "firebase/messaging";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { messaging, db } from "../firebase";

const VAPID_KEY =
  "BOgGh02Vhy7drnkD4tcEc3gTdEVL1bMrLcyQ7kHx0w7QEGEvPLbrTiLz6vYroe6mLkbvIbECRLUYkE";

export async function requestNotificationPermission(member) {
  try {
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      console.log(
        "This browser does not support notifications."
      );
      return null;
    }

    const permission =
      await Notification.requestPermission();

    if (permission !== "granted") {
      console.log(
        "Notification permission was not granted."
      );
      return null;
    }

    const registration =
      await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.log(
        "No FCM registration token available."
      );
      return null;
    }

    console.log("FCM Token:", token);

    if (member?.sertId) {
      await setDoc(
        doc(
          db,
          "notificationTokens",
          member.sertId
        ),
        {
          token,
          sertId: member.sertId,
          name: member.name || "",
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      console.log(
        "FCM token saved to Firestore."
      );
    }

    return token;
  } catch (error) {
    console.error(
      "Error getting notification permission/token:",
      error
    );

    return null;
  }
}

export function showAnnouncementNotification(
  announcement
) {
  try {
    if (
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    new Notification(
      `📢 ${
        announcement.title ||
        "New SERT Announcement"
      }`,
      {
        body:
          announcement.message ||
          "A new announcement has been posted.",
        icon: "/sert-logo.jpg",
        tag: `announcement-${announcement.id}`,
      }
    );
  } catch (error) {
    console.error(
      "Error showing announcement notification:",
      error
    );
  }
}