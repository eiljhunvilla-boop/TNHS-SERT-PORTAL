import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

// ==========================================
// FIREBASE ADMIN
// ==========================================

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID;

  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL;

  const privateKey =
    process.env.FIREBASE_PRIVATE_KEY;

  // ----------------------------------------
  // CHECK ENVIRONMENT VARIABLES
  // ----------------------------------------

  if (!projectId) {
    throw new Error(
      "Missing FIREBASE_PROJECT_ID environment variable."
    );
  }

  if (!clientEmail) {
    throw new Error(
      "Missing FIREBASE_CLIENT_EMAIL environment variable."
    );
  }

  if (!privateKey) {
    throw new Error(
      "Missing FIREBASE_PRIVATE_KEY environment variable."
    );
  }

  // ----------------------------------------
  // FIX PRIVATE KEY LINE BREAKS
  // ----------------------------------------

  const formattedPrivateKey =
    privateKey.replace(/\\n/g, "\n");

  // ----------------------------------------
  // INITIALIZE FIREBASE ADMIN
  // ----------------------------------------

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: formattedPrivateKey,
    }),
  });
}

// ==========================================
// API HANDLER
// ==========================================

export default async function handler(req, res) {

  // ========================================
  // CORS
  // ========================================

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

  // ========================================
  // OPTIONS
  // ========================================

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ========================================
  // POST ONLY
  // ========================================

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  try {

    console.log(
      "================================="
    );

    console.log(
      "SERT FCM API REQUEST RECEIVED"
    );

    console.log(
      "================================="
    );

    // ======================================
    // INITIALIZE FIREBASE
    // ======================================

    const firebaseAdmin =
      getFirebaseAdmin();

    const db =
      getFirestore(firebaseAdmin);

    const messaging =
      getMessaging(firebaseAdmin);

    console.log(
      "Firebase Admin initialized."
    );

    // ======================================
    // READ REQUEST BODY
    // ======================================

    const {
      title,
      message,
      id,
    } = req.body || {};

    console.log(
      "Notification title:",
      title
    );

    console.log(
      "Notification ID:",
      id
    );

    // ======================================
    // VALIDATE
    // ======================================

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error:
          "Title and message are required.",
      });
    }

    // ======================================
    // GET DEVICE TOKENS
    // ======================================

    console.log(
      "Reading notificationTokens..."
    );

    const snapshot =
      await db
        .collection("notificationTokens")
        .get();

    console.log(
      "Token documents found:",
      snapshot.size
    );

    // ======================================
    // EXTRACT TOKENS
    // ======================================

    const tokens =
      snapshot.docs
        .map((document) => {
          const data =
            document.data();

          return data?.token;
        })
        .filter(
          (token) =>
            typeof token === "string" &&
            token.length > 0
        );

    // ======================================
    // REMOVE DUPLICATES
    // ======================================

    const uniqueTokens =
      [...new Set(tokens)];

    console.log(
      "Unique FCM tokens:",
      uniqueTokens.length
    );

    // ======================================
    // NO DEVICES
    // ======================================

    if (uniqueTokens.length === 0) {

      return res.status(200).json({
        success: true,

        message:
          "Announcement saved, but no registered devices were found.",

        totalDevices: 0,

        sent: 0,

        failed: 0,
      });
    }

    // ======================================
    // FCM LIMIT
    // ======================================

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

    // ======================================
    // SEND NOTIFICATIONS
    // ======================================

    let totalSuccess = 0;
    let totalFailure = 0;

    for (const tokenChunk of chunks) {

      console.log(
        "Sending to devices:",
        tokenChunk.length
      );

      const response =
        await messaging.sendEachForMulticast({

          tokens:
            tokenChunk,

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

      console.log(
        "FCM batch result:",
        {
          success:
            response.successCount,

          failure:
            response.failureCount,
        }
      );

      // ====================================
      // LOG FAILED TOKENS
      // ====================================

      response.responses.forEach(
        (result, index) => {

          if (!result.success) {

            console.error(
              "FCM token failed:",
              {
                index,
                error:
                  result.error?.message ||
                  "Unknown FCM error.",
              }
            );

          }

        }
      );
    }

    // ======================================
    // FINAL RESULT
    // ======================================

    console.log(
      "================================="
    );

    console.log(
      "FCM SEND COMPLETE"
    );

    console.log({
      totalDevices:
        uniqueTokens.length,

      success:
        totalSuccess,

      failed:
        totalFailure,
    });

    console.log(
      "================================="
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

    // ======================================
    // ERROR
    // ======================================

    console.error(
      "================================="
    );

    console.error(
      "FCM SEND ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );

    return res.status(500).json({

      success: false,

      error:
        error?.message ||
        "Failed to send notification.",
    });
  }
}