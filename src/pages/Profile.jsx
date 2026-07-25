import { Navigate } from "react-router-dom";
import DashboardLayout from "../components/ui/layout/DashboardLayout";

export default function Profile() {
  const member = JSON.parse(localStorage.getItem("sertMember"));

  if (!member) {
    return <Navigate to="/" replace />;
  }

  const rank =
    member.bls &&
    member.trauma &&
    member.carriesTransportation
      ? "Senior"
      : "Neophyte";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-white">
          My Profile
        </h1>

        <p className="mt-2 text-gray-400">
          View your membership information.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#182234]/70 p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center">

            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
              {member.name
                ?.split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              {member.name}
            </h2>

            <p className="mt-2 text-gray-400">
              {member.sertId}
            </p>

            <div className="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-2 text-white">
              {rank}
            </div>

            <div className="mt-10 grid w-full gap-5 md:grid-cols-2">

              <div className="rounded-2xl bg-[#101B2E] p-5">
                <p className="text-sm text-gray-400">
                  Full Name
                </p>

                <h3 className="mt-2 text-xl text-white">
                  {member.name}
                </h3>
              </div>

              <div className="rounded-2xl bg-[#101B2E] p-5">
                <p className="text-sm text-gray-400">
                  SERT ID
                </p>

                <h3 className="mt-2 text-xl text-white">
                  {member.sertId}
                </h3>
              </div>

              <div className="rounded-2xl bg-[#101B2E] p-5">
                <p className="text-sm text-gray-400">
                  Current Rank
                </p>

                <h3 className="mt-2 text-xl text-blue-300">
                  {rank}
                </h3>
              </div>

              <div className="rounded-2xl bg-[#101B2E] p-5">
                <p className="text-sm text-gray-400">
                  Membership Status
                </p>

                <h3 className="mt-2 text-xl text-green-400">
                  Active
                </h3>
              </div>

            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}