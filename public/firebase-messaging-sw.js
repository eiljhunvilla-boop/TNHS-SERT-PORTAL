importScripts(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAXCKHOnqcbe2CVnaQdOWMaZu5qwRtkRzs",
  authDomain: "tnhs-sert-portal.firebaseapp.com",
  projectId: "tnhs-sert-portal",
  storageBucket: "tnhs-sert-portal.firebasestorage.app",
  messagingSenderId: "834625062906",
  appId: "1:834625062906:web:705a6498f5504997c18643",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message:",
    payload
  );

  const notificationTitle =
    payload.notification?.title || "TNHS SERT";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "You have a new announcement.",
    icon: "/sert-logo.jpg",
    badge: "/sert-logo.jpg",
    data: payload.data || {},
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});