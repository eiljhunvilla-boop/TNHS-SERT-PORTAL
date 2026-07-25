import { getDoc } from "firebase/firestore";

import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

// =============================
// FIRESTORE COLLECTION
// =============================

const membersRef = collection(db, "members");

// =============================
// REAL-TIME MEMBER LISTENER
// =============================

export function subscribeMembers(callback) {
  return onSnapshot(membersRef, (snapshot) => {
    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(members);
  });
}

// =============================
// GET ALL MEMBERS
// =============================

export async function getMembersFirestore() {
  const snapshot = await getDocs(membersRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// =============================
// ADD MEMBER
// Uses the SERT ID as the Firestore document ID
// =============================

export async function addMemberFirestore(member) {
  const memberDoc = doc(db, "members", member.sertId);

  await setDoc(memberDoc, member);
}

// =============================
// UPDATE MEMBER
// =============================

export async function updateMemberFirestore(id, member) {
  const memberDoc = doc(db, "members", id);

  await updateDoc(memberDoc, member);
}

// =============================
// DELETE MEMBER
// =============================

export async function deleteMemberFirestore(id) {
  const memberDoc = doc(db, "members", id);

  await deleteDoc(memberDoc);
}

// =============================
// GET ONE MEMBER
// =============================

export async function getMemberFirestore(sertId) {
  const memberDoc = doc(db, "members", sertId);

  const snapshot = await getDoc(memberDoc);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}