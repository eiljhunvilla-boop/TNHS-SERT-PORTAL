import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, Lock } from "lucide-react";

import logo from "../assets/images/sert-logo.jpg";

import AuthLayout from "../components/ui/layout/AuthLayout";
import GlassCard from "../components/ui/Glasscard";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";

import { getMembersFirestore } from "../services/memberService";
import {
  requestNotificationPermission,
} from "../services/notificationService";

export default function Login() {
  const navigate = useNavigate();

  const [sertId, setSertId] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const firestoreMembers =
        await getMembersFirestore();

      const member = firestoreMembers.find(
        (m) =>
          m?.sertId?.trim().toLowerCase() ===
            sertId.trim().toLowerCase() &&
          m?.secretCode?.trim() ===
            secretCode.trim()
      );

      if (!member) {
        setError(
          "Invalid SERT ID or Secret Code"
        );
        setLoading(false);
        return;
      }

      // Save logged-in member
      localStorage.setItem(
        "sertMember",
        JSON.stringify(member)
      );

      /*
       * Register this device for Firebase
       * Cloud Messaging notifications.
       *
       * Notification registration should NOT
       * prevent the member from logging in.
       */
      try {
        await requestNotificationPermission(
          member
        );
      } catch (notificationError) {
        console.error(
          "NOTIFICATION REGISTRATION ERROR:",
          notificationError
        );
      }

      // Go to dashboard after login
      navigate("/dashboard");

    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <GlassCard>
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl lg:grid-cols-2">

          {/* LEFT PANEL */}

          <div className="hidden flex-col justify-center bg-gradient-to-br from-[#2563EB] to-[#0F3D91] p-12 lg:flex">

            <img
              src={logo}
              alt="SERT Logo"
              className="mb-8 h-28 w-28 rounded-full border-4 border-white"
            />

            <h1 className="text-5xl font-bold text-white">
              TNHS
            </h1>

            <h2 className="mt-2 text-3xl font-semibold text-blue-100">
              SERT Portal
            </h2>

            <div className="mt-4 inline-flex w-fit rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-100">
              Secure Member Portal
            </div>

            <p className="mt-8 leading-8 text-blue-100">
              School Emergency Response Team
              Management System for announcements,
              member records, trainings, quizzes,
              and responder information.
            </p>

          </div>

          {/* RIGHT PANEL */}

          <div className="p-10 md:p-14">

            <div className="flex justify-center lg:hidden">
              <img
                src={logo}
                alt="SERT Logo"
                className="h-24 w-24 rounded-full border-4 border-blue-500"
              />
            </div>

            <h2 className="mt-6 text-center text-4xl font-extrabold text-white lg:text-left">
              Welcome Back
            </h2>

            <p className="mt-2 text-center text-gray-400 lg:text-left">
              Sign in using your SERT ID.
            </p>

            <InputField
              icon={<User size={20} />}
              label="SERT ID Number"
              type="text"
              placeholder="TNHS-SERT-26002"
              value={sertId}
              onChange={(e) =>
                setSertId(e.target.value)
              }
            />

            <InputField
              icon={<Lock size={20} />}
              label="Secret Code"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter Secret Code"
              value={secretCode}
              onChange={(e) =>
                setSecretCode(e.target.value)
              }
              showPassword={showPassword}
              togglePassword={() =>
                setShowPassword(
                  !showPassword
                )
              }
            />

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <PrimaryButton
              onClick={handleLogin}
              disabled={loading}
            >
              <span className="flex items-center justify-center gap-2">
                <Shield size={20} />

                {loading
                  ? "Signing In..."
                  : "Login"}
              </span>
            </PrimaryButton>

            <p className="mt-8 text-center text-sm text-gray-500">
              © 2026 TNHS School Emergency
              Response Team
            </p>

          </div>

        </div>
      </GlassCard>
    </AuthLayout>
  );
}