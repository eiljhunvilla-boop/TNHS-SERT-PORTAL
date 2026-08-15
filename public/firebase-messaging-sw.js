importScripts(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey:
    "AIzaSyAXCKHOnqcbe2CVnaQdOWZu5qwRtkRzs",

  authDomain:
    "tnhs-sert-portal.firebaseapp.com",

  projectId:
    "tnhs-sert-portal",

  storageBucket:
    "tnhs-sert-portal.firebasestorage.app",

  messagingSenderId:
    "834625062906",

  appId:
    "1:834625062906:web:705a6498f5504997c18643",
});

const messaging = firebase.messaging();

/*
 * Handle FCM messages when the SERT Portal
 * is in the background.
 */
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[FCM SW] Background message received:",
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

  const notificationId =
    payload.data?.id ||
    Date.now().toString();

  const notificationOptions = {
    body: body,

    icon: "/sert-logo.jpg",

    badge: "/sert-logo.jpg",

    tag: `sert-${notificationId}`,

    renotify: true,

    data: {
      ...payload.data,

      url: "/dashboard",
    },
  };

  return self.registration.showNotification(
    title,
    notificationOptions
  );
});

/*
 * When the user taps the notification,
 * open the SERT Portal.
 */
self.addEventListener(
  "notificationclick",
  (event) => {
    console.log(
      "[FCM SW] Notification clicked."
    );

    event.notification.close();

    const url =
      event.notification?.data?.url ||
      "/dashboard";

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            if (
              "focus" in client
            ) {
              client.navigate(url);
              return client.focus();
            }
          }

          if (
            clients.openWindow
          ) {
            return clients.openWindow(
              url
            );
          }

          return null;
        })
    );
  }
);