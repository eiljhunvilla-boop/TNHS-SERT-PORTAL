import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import {
  getFirestore,
} from "firebase-admin/firestore";

import {
  getMessaging,
} from "firebase-admin/messaging";

// ==========================================
// FIREBASE ADMIN INITIALIZATION
// ==========================================

const firebaseAdminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId:
            process.env.FIREBASE_PROJECT_ID,

          clientEmail:
            process.env.FIREBASE_CLIENT_EMAIL,

          privateKey:
            process.env.FIREBASE_PRIVATE_KEY.replace(
              /\\n/g,
              "\n"
            ),
        }),
      });

const db =
  getFirestore(firebaseAdminApp);

const messaging =
  getMessaging(firebaseAdminApp);

// ==========================================
// VERCEL API HANDLER
// ==========================================

export default async function handler(
  req,
  res
) {

  // ----------------------------------------
  // CORS
  // ----------------------------------------

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // ----------------------------------------
  // PREFLIGHT REQUEST
  // ----------------------------------------

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ----------------------------------------
  // ONLY POST
  // ----------------------------------------

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  try {

    const {
      title,
      message,
      id,
    } = req.body || {};

    // --------------------------------------
    // VALIDATE INPUT
    // --------------------------------------

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error:
          "Title and message are required.",
      });
    }

    // --------------------------------------
    // GET ALL REGISTERED DEVICE TOKENS
    // --------------------------------------

    const snapshot =
      await db
        .collection("notificationTokens")
        .get();

    const tokens =
      snapshot.docs
        .map((document) =>
          document.data()?.token
        )
        .filter(Boolean);

    if (tokens.length === 0) {

      return res.status(200).json({
        success: true,
        message:
          "Announcement saved, but no registered devices were found.",
        sent: 0,
        failed: 0,
      });

    }

    // --------------------------------------
    // REMOVE DUPLICATE TOKENS
    // --------------------------------------

    const uniqueTokens =
      [...new Set(tokens)];

    // --------------------------------------
    // FCM SUPPORTS UP TO 500 TOKENS
    // PER MULTICAST REQUEST
    // --------------------------------------

    const chunks = [];

    for (
      let i = 0;
      i < uniqueTokens.length;
      i += 500
    ) {

      chunks.push(
        uniqueTokens.slice(
          i,
          i + 500
        )
      );

    }

    let totalSuccess = 0;
    let totalFailure = 0;

    // --------------------------------------
    // SEND TO EVERY REGISTERED DEVICE
    // --------------------------------------

    for (const tokenChunk of chunks) {

      const response =
        await messaging.sendEachForMulticast({
          tokens: tokenChunk,

          notification: {
            title:
              `📢 ${title}`,

            body:
              message,
          },

          data: {
            id:
              String(
                id ||
                Date.now()
              ),

            title:
              String(title),

            body:
              String(message),

            url:
              "/dashboard",
          },

          webpush: {
            notification: {
              title:
                `📢 ${title}`,

              body:
                message,

              icon:
                "/sert-logo.jpg",

              badge:
                "/sert-logo.jpg",

              requireInteraction:
                false,
            },

            fcmOptions: {
              link:
                "/dashboard",
            },
          },
        });

      totalSuccess +=
        response.successCount;

      totalFailure +=
        response.failureCount;
    }

    // --------------------------------------
    // RESULT
    // --------------------------------------

    console.log(
      "FCM notification result:",
      {
        totalDevices:
          uniqueTokens.length,

        success:
          totalSuccess,

        failed:
          totalFailure,
      }
    );

    return res.status(200).json({
      success: true,

      totalDevices:
        uniqueTokens.length,

      sent:
        totalSuccess,

      failed:
        totalFailure,
    });

  } catch (error) {

    console.error(
      "FCM SEND ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      error:
        error?.message ||
        "Failed to send notification.",
    });
  }
}