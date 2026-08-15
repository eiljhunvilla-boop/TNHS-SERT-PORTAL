import { Navigate, useNavigate } from "react-router-dom";
import {
  KeyRound,
  Palette,
  LogOut,
} from "lucide-react";

import DashboardLayout from "../components/ui/layout/DashboardLayout";

export default function Settings() {
  const navigate = useNavigate();

  // ==========================================
  // GET CURRENT MEMBER
  // ==========================================

  let member = null;

  try {
    member = JSON.parse(
      localStorage.getItem("sertMember")
    );
  } catch (error) {
    console.error(
      "Failed to read saved member:",
      error
    );

    member = null;
  }

  // ==========================================
  // PROTECT SETTINGS PAGE
  // ==========================================

  if (!member) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // ==========================================
  // SIGN OUT
  // ==========================================

  function handleSignOut() {
    localStorage.removeItem("sertMember");

    navigate("/", {
      replace: true,
    });
  }

  return (
    <DashboardLayout>

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <h1 className="text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your account preferences.
        </p>

        <div className="mt-8 space-y-6">

          {/* ==========================================
              CHANGE SECRET CODE
          ========================================== */}

          <div className="rounded-3xl border border-white/10 bg-[#182234]/70 p-6 backdrop-blur-xl">

            <div className="flex items-center gap-4">

              <KeyRound
                className="text-blue-400"
                size={28}
              />

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Change Secret Code
                </h2>

                <p className="text-gray-400">
                  Prototype feature. Coming soon.
                </p>

              </div>

            </div>

          </div>

          {/* ==========================================
              APPEARANCE
          ========================================== */}

          <div className="rounded-3xl border border-white/10 bg-[#182234]/70 p-6 backdrop-blur-xl">

            <div className="flex items-center gap-4">

              <Palette
                className="text-purple-400"
                size={28}
              />

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Appearance
                </h2>

                <p className="text-gray-400">
                  Dark Mode enabled by default.
                </p>

              </div>

            </div>

          </div>

          {/* ==========================================
              SIGN OUT
          ========================================== */}

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-left transition hover:bg-red-500/20"
          >

            <div className="flex items-center gap-4">

              <LogOut
                className="text-red-400"
                size={28}
              />

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Sign Out
                </h2>

                <p className="text-gray-400">
                  Return to the login page.
                </p>

              </div>

            </div>

          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}