import {
  getToken,
  onMessage,
} from "firebase/messaging";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { messaging, db } from "../firebase";

// Firebase Console → Project Settings
// → Cloud Messaging → Web Push certificates
const VAPID_KEY =
  "BOgGh02Vhy7drnkD4tcEc3gTdEVL1bMrLcyQ7kHx0w7QEGEvPLbrTiLz6vYroe6mLkbvIbECRLUYkE";

/**
 * Register Firebase Messaging Service Worker
 */
async function registerMessagingServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.error(
      "Service workers are not supported by this browser."
    );

    return null;
  }

  try {
    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

    console.log(
      "Firebase Messaging Service Worker registered:",
      registration.scope
    );

    return registration;
  } catch (error) {
    console.error(
      "Failed to register Firebase Messaging Service Worker:",
      error
    );

    return null;
  }
}

/**
 * Request notification permission,
 * generate FCM token, and save it to Firestore.
 */
export async function requestNotificationPermission(
  member
) {
  try {
    // Check browser support
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      console.log(
        "This browser does not support notifications."
      );

      return null;
    }

    // Request notification permission
    const permission =
      await Notification.requestPermission();

    console.log(
      "Notification permission:",
      permission
    );

    if (permission !== "granted") {
      console.log(
        "Notification permission was not granted."
      );

      return null;
    }

    // Register Firebase Messaging service worker
    const registration =
      await registerMessagingServiceWorker();

    if (!registration) {
      console.error(
        "Firebase Messaging service worker registration failed."
      );

      return null;
    }

    // Get FCM registration token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.error(
        "No FCM registration token available."
      );

      return null;
    }

    console.log(
      "FCM Token successfully generated."
    );

    // Save token to Firestore
    if (member?.sertId) {
      await setDoc(
        doc(
          db,
          "notificationTokens",
          member.sertId
        ),
        {
          token: token,
          sertId: member.sertId,
          name: member.name || "",
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      console.log(
        `FCM token saved for ${member.sertId}.`
      );
    } else {
      console.warn(
        "No SERT ID was provided. FCM token was not saved to Firestore."
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

/**
 * Listen for notifications while the SERT Portal
 * is currently open.
 */
export function listenForForegroundMessages() {
  try {
    const unsubscribe = onMessage(
      messaging,
      (payload) => {
        console.log(
          "Foreground FCM message received:",
          payload
        );

        const title =
          payload.notification?.title ||
          payload.data?.title ||
          "📢 TNHS SERT";

        const body =
          payload.notification?.body ||
          payload.data?.body ||
          "You have a new announcement.";

        showAnnouncementNotification({
          title,
          message: body,
          id:
            payload.data?.id ||
            Date.now().toString(),
        });
      }
    );

    console.log(
      "Foreground notification listener started."
    );

    return unsubscribe;
  } catch (error) {
    console.error(
      "Failed to start foreground notification listener:",
      error
    );

    return null;
  }
}

/**
 * Display a notification while the portal
 * is currently open.
 */
export function showAnnouncementNotification(
  announcement
) {
  try {
    if (
      !("Notification" in window)
    ) {
      console.log(
        "Notifications are not supported."
      );

      return;
    }

    if (
      Notification.permission !==
      "granted"
    ) {
      console.log(
        "Notification permission is not granted."
      );

      return;
    }

    const title =
      announcement?.title ||
      "📢 New SERT Announcement";

    const body =
      announcement?.message ||
      "A new announcement has been posted.";

    const notification =
      new Notification(title, {
        body: body,
        icon: "/sert-logo.jpg",
        badge: "/sert-logo.jpg",
        tag:
          announcement?.id ||
          `announcement-${Date.now()}`,
      });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    console.log(
      "Foreground notification displayed."
    );
  } catch (error) {
    console.error(
      "Error showing announcement notification:",
      error
    );
  }
}