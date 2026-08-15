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

let firebaseAdminApp;

try {
  const projectId =
    process.env.FIREBASE_PROJECT_ID;

  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL;

  let privateKey =
    process.env.FIREBASE_PRIVATE_KEY;

  // Convert escaped \n characters into real
  // line breaks.
  if (privateKey) {
    privateKey = privateKey
      .replace(/\\n/g, "\n")
      .replace(/^"(.*)"$/s, "$1")
      .trim();
  }

  if (
    !projectId ||
    !clientEmail ||
    !privateKey
  ) {
    throw new Error(
      "Firebase Admin environment variables are missing."
    );
  }

  firebaseAdminApp =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });

} catch (error) {

  console.error(
    "FIREBASE ADMIN INITIALIZATION ERROR:",
    error
  );

  throw error;
}

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
  // PREFLIGHT
  // ========================================

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }


  // ========================================
  // ONLY POST
  // ========================================

  if (req.method !== "POST") {

    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });

  }


  try {

    // ======================================
    // REQUEST DATA
    // ======================================

    const {
      title,
      message,
      id,
    } = req.body || {};


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

    const snapshot =
      await db
        .collection("notificationTokens")
        .get();


    const tokens =
      snapshot.docs
        .map((document) => {

          const data =
            document.data();

          return data?.token;

        })
        .filter(Boolean);


    // ======================================
    // NO DEVICES
    // ======================================

    if (tokens.length === 0) {

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
    // REMOVE DUPLICATE TOKENS
    // ======================================

    const uniqueTokens =
      [...new Set(tokens)];


    // ======================================
    // FCM MAXIMUM
    // 500 TOKENS PER REQUEST
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
    // COUNTERS
    // ======================================

    let totalSuccess = 0;

    let totalFailure = 0;


    // ======================================
    // SEND NOTIFICATIONS
    // ======================================

    for (
      const tokenChunk of chunks
    ) {

      const response =
        await messaging.sendEachForMulticast({

          tokens:
            tokenChunk,


          // ----------------------------------
          // FCM NOTIFICATION PAYLOAD
          // ----------------------------------

          notification: {

            title:
              `📢 ${title}`,

            body:
              message,

          },


          // ----------------------------------
          // DATA PAYLOAD
          // ----------------------------------

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


          // ----------------------------------
          // WEB PUSH CONFIGURATION
          // ----------------------------------

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


      // ------------------------------------
      // COUNT RESULTS
      // ------------------------------------

      totalSuccess +=
        response.successCount;

      totalFailure +=
        response.failureCount;


      // ------------------------------------
      // LOG INDIVIDUAL FAILURES
      // ------------------------------------

      response.responses.forEach(
        (result, index) => {

          if (!result.success) {

            console.error(
              "FCM TOKEN FAILED:",
              {
                token:
                  tokenChunk[index],

                error:
                  result.error?.message,

                code:
                  result.error?.code,
              }
            );

          }

        }
      );

    }


    // ======================================
    // LOG FINAL RESULT
    // ======================================

    console.log(
      "================================="
    );

    console.log(
      "FCM NOTIFICATION RESULT"
    );

    console.log({
      totalDevices:
        uniqueTokens.length,

      sent:
        totalSuccess,

      failed:
        totalFailure,
    });

    console.log(
      "================================="
    );


    // ======================================
    // SUCCESS RESPONSE
    // ======================================

    return res.status(200).json({

      success:
        totalSuccess > 0,

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
      "FCM SEND ERROR:"
    );

    console.error(error);

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