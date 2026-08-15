import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyAXCKHOnqcbe2CVnaQdOWMaZu5qwRtkRzs",
  authDomain: "tnhs-sert-portal.firebaseapp.com",
  projectId: "tnhs-sert-portal",
  storageBucket: "tnhs-sert-portal.firebasestorage.app",
  messagingSenderId: "834625062906",
  appId: "1:834625062906:web:705a6498f5504997c18643",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

export default app;