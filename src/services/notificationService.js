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

// ==========================================
// FIREBASE WEB PUSH VAPID PUBLIC KEY
// ==========================================

const VAPID_KEY =
  "BOgGh02Vhy7drnkD4tcEc3gTdEVL1bMrLcyQ7kHx2IKquiOpV_07QEGEvPLbrTiLz6vYroe6mLkbvIbECRLUYkE";

// ==========================================
// CREATE / GET UNIQUE DEVICE ID
// ==========================================

function getDeviceId() {
  const STORAGE_KEY = "sertDeviceId";

  let deviceId =
    localStorage.getItem(STORAGE_KEY);

  if (!deviceId) {
    deviceId =
      crypto.randomUUID();

    localStorage.setItem(
      STORAGE_KEY,
      deviceId
    );
  }

  return deviceId;
}

// ==========================================
// REGISTER FIREBASE MESSAGING SERVICE WORKER
// ==========================================

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
        "/firebase-messaging-sw.js",
        {
          scope: "/",
        }
      );

    console.log(
      "FCM Service Worker registered:",
      registration.scope
    );

    await navigator.serviceWorker.ready;

    console.log(
      "FCM Service Worker is ready."
    );

    return registration;

  } catch (error) {

    console.error(
      "FCM Service Worker registration failed:",
      error
    );

    return null;
  }
}

// ==========================================
// REQUEST NOTIFICATION PERMISSION
// GENERATE FCM TOKEN
// SAVE DEVICE TOKEN
// ==========================================

export async function requestNotificationPermission(
  member
) {
  try {

    // --------------------------------------
    // CHECK BROWSER SUPPORT
    // --------------------------------------

    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      console.error(
        "This browser does not support push notifications."
      );

      return null;
    }

    console.log(
      "Current notification permission:",
      Notification.permission
    );

    // --------------------------------------
    // REQUEST PERMISSION
    // --------------------------------------

    let permission =
      Notification.permission;

    if (permission === "default") {
      permission =
        await Notification.requestPermission();

      console.log(
        "Notification permission after request:",
        permission
      );
    }

    if (permission !== "granted") {
      console.error(
        "Notification permission is not granted."
      );

      return null;
    }

    // --------------------------------------
    // REGISTER SERVICE WORKER
    // --------------------------------------

    const registration =
      await registerMessagingServiceWorker();

    if (!registration) {
      console.error(
        "Could not register Firebase Messaging Service Worker."
      );

      return null;
    }

    // --------------------------------------
    // GENERATE FCM TOKEN
    // --------------------------------------

    const token =
      await getToken(
        messaging,
        {
          vapidKey:
            VAPID_KEY,

          serviceWorkerRegistration:
            registration,
        }
      );

    if (!token) {
      console.error(
        "FCM registration token was not generated."
      );

      return null;
    }

    console.log(
      "================================="
    );

    console.log(
      "FCM TOKEN GENERATED SUCCESSFULLY"
    );

    console.log(token);

    console.log(
      "================================="
    );

    // --------------------------------------
    // DEVICE ID
    // --------------------------------------

    const deviceId =
      getDeviceId();

    console.log(
      "SERT Device ID:",
      deviceId
    );

    // --------------------------------------
    // SAVE TOKEN
    // --------------------------------------

    if (member?.sertId) {

      /*
       * Use the FCM token as the document ID.
       *
       * This allows multiple devices for the
       * same SERT member to receive notifications.
       */

      const tokenDocument =
        doc(
          db,
          "notificationTokens",
          token
        );

      await setDoc(
        tokenDocument,
        {
          token:
            token,

          sertId:
            member.sertId,

          name:
            member.name || "",

          platform:
            "web",

          deviceId:
            deviceId,

          updatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      console.log(
        "FCM token saved to Firestore."
      );

      console.log(
        "Member:",
        member.sertId
      );

      console.log(
        "Device:",
        deviceId
      );

    } else {

      console.warn(
        "No SERT ID found. Token was generated but not saved."
      );
    }

    return token;

  } catch (error) {

    console.error(
      "FCM notification registration error:",
      error
    );

    return null;
  }
}

// ==========================================
// FOREGROUND FCM MESSAGES
// ==========================================

export function listenForForegroundMessages() {

  try {

    const unsubscribe =
      onMessage(
        messaging,
        (payload) => {

          console.log(
            "================================="
          );

          console.log(
            "FOREGROUND FCM MESSAGE RECEIVED"
          );

          console.log(
            payload
          );

          console.log(
            "================================="
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

            message:
              body,

            id:
              payload.data?.id ||
              Date.now().toString(),
          });
        }
      );

    console.log(
      "Foreground FCM listener started."
    );

    return unsubscribe;

  } catch (error) {

    console.error(
      "Could not start foreground FCM listener:",
      error
    );

    return null;
  }
}

// ==========================================
// DISPLAY BROWSER NOTIFICATION
// ==========================================

export function showAnnouncementNotification(
  announcement
) {

  try {

    if (!("Notification" in window)) {

      console.error(
        "Notifications are not supported."
      );

      return;
    }

    if (
      Notification.permission !==
      "granted"
    ) {

      console.error(
        "Notification permission is not granted."
      );

      return;
    }

    const title =
      announcement?.title ||
      "📢 TNHS SERT";

    const body =
      announcement?.message ||
      "You have a new announcement.";

    const notification =
      new Notification(
        title,
        {
          body,

          icon:
            "/sert-logo.jpg",

          badge:
            "/sert-logo.jpg",

          tag:
            announcement?.id ||
            `announcement-${Date.now()}`,
        }
      );

    notification.onclick =
      () => {

        window.focus();

        notification.close();

      };

    console.log(
      "Browser notification displayed."
    );

  } catch (error) {

    console.error(
      "Failed to display notification:",

      error
    );
  }
}