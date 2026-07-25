import { Navigate } from "react-router-dom";
import DashboardLayout from "../components/ui/layout/DashboardLayout";

function Card(title, done) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#182234]/70 p-6">
      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      <p
        className={`mt-4 text-lg font-semibold ${
          done ? "text-green-400" : "text-yellow-400"
        }`}
      >
        {done ? "✅ Completed" : "⏳ Pending"}
      </p>
    </div>
  );
}

export default function Training() {
  const member = JSON.parse(localStorage.getItem("sertMember"));

  // Protect this page
  if (!member) {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold text-white">
          Training Progress
        </h1>

        <p className="mt-2 text-gray-400">
          View your completed SERT trainings.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {Card("Basic Life Support", member.bls)}

          {Card("Trauma Care", member.trauma)}

          {Card(
            "Carries & Transportation",
            member.carriesTransportation
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}