import { useState } from "react";

import { members } from "../data/members";

import {
  addMemberFirestore,
} from "../services/memberService";

export default function MigrateMembers() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function migrate() {
    try {
      setLoading(true);

      alert("Migration started...");

      for (const member of members) {
        await addMemberFirestore(member);
      }

      setDone(true);

      alert("Migration Complete!");
    } catch (error) {
      console.error(error);
      alert("Migration failed.\n\n" + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
        minHeight: "100vh",
        background: "#0f172a",
        fontFamily: "Arial",
      }}
    >
      <h1>Firebase Member Migration</h1>

      <p>
        Click the button below to upload all members from
        <strong> members.js </strong>
        into Firestore.
      </p>

      <button
        onClick={migrate}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "14px 28px",
          backgroundColor: loading ? "#64748b" : "#2563eb",
          color: "#ffffff",
          border: "none",
          borderRadius: "10px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Uploading..." : "Upload Members"}
      </button>

      {done && (
        <h2
          style={{
            marginTop: "20px",
            color: "#22c55e",
          }}
        >
          ✅ Migration Complete!
        </h2>
      )}
    </div>
  );
}