import { Navigate } from "react-router-dom";
import DashboardLayout from "../components/ui/layout/DashboardLayout";
import MemberIDCard from "../components/ui/admin/MemberIDCard";
import { calculateAge } from "../utils/calculateAge";

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

  const age = calculateAge(member.birthdate);

  const initials = member.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const formattedBirthdate = member.birthdate
    ? new Date(
        member.birthdate + "T00:00:00"
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not provided";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <h1 className="text-4xl font-bold text-white">
          My Profile
        </h1>

        <p className="mt-2 text-gray-400">
          View your complete SERT membership information,
          digital ID, and training progress.
        </p>


        {/* ================= MAIN PROFILE ================= */}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">


          {/* ================= MEMBER INFORMATION ================= */}

          <div className="rounded-3xl border border-white/10 bg-[#182234]/70 p-8 backdrop-blur-xl">

            <div className="flex flex-col items-center">

              {/* Profile Photo */}

              {member.photo ? (

                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-28 w-28 rounded-full border-4 border-blue-500 object-cover shadow-xl"
                />

              ) : (

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white shadow-xl">
                  {initials}
                </div>

              )}


              {/* Name */}

              <h2 className="mt-6 text-center text-3xl font-bold text-white">
                {member.name}
              </h2>


              {/* SERT ID */}

              <p className="mt-2 text-gray-400">
                {member.sertId}
              </p>


              {/* Rank */}

              <span
                className={`mt-4 rounded-full px-5 py-2 font-semibold ${
                  rank === "Senior"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {rank}
              </span>

            </div>


            {/* ================= COMPLETE INFORMATION ================= */}

            <div className="mt-10 grid gap-4">

              <Info
                label="Full Name"
                value={member.name}
              />

              <Info
                label="SERT ID"
                value={member.sertId}
              />

              <Info
                label="Birthdate"
                value={formattedBirthdate}
              />

              <Info
                label="Age"
                value={
                  age !== ""
                    ? `${age} years old`
                    : "Not provided"
                }
              />

              <Info
                label="Contact Number"
                value={
                  member.contactNumber ||
                  "Not provided"
                }
              />

              <Info
                label="Address"
                value={
                  member.address ||
                  "Not provided"
                }
              />

              <Info
                label="Current Rank"
                value={rank}
              />

              <Info
                label="Membership Status"
                value={member.status || "Active"}
              />

              <Info
                label="Administrator"
                value={
                  member.isAdmin
                    ? "YES"
                    : "NO"
                }
              />

            </div>

          </div>


          {/* ================= DIGITAL ID ================= */}

          <div className="rounded-3xl border border-white/10 bg-[#182234]/70 p-8 backdrop-blur-xl">

            <h2 className="mb-2 text-2xl font-bold text-white">
              My Digital ID
            </h2>

            <p className="mb-6 text-gray-400">
              Your official TNHS SERT digital identification card.
            </p>

            <MemberIDCard member={member} />

          </div>

        </div>


        {/* ================= TRAINING ================= */}

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#182234]/70 p-8 backdrop-blur-xl">

          <h2 className="text-2xl font-bold text-white">
            Training Progress
          </h2>

          <p className="mt-2 text-gray-400">
            Your current SERT training completion status.
          </p>


          <div className="mt-8 grid gap-6 md:grid-cols-3">

            <TrainingCard
              title="Basic Life Support"
              done={member.bls}
            />

            <TrainingCard
              title="Trauma Care"
              done={member.trauma}
            />

            <TrainingCard
              title="Carries & Transportation"
              done={member.carriesTransportation}
            />

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}


/* ================= INFORMATION CARD ================= */

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-[#101B2E] p-4">

      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-white">
        {value}
      </p>

    </div>
  );
}


/* ================= TRAINING CARD ================= */

function TrainingCard({ title, done }) {
  return (
    <div className="rounded-2xl bg-[#101B2E] p-6">

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p
        className={`mt-4 font-semibold ${
          done
            ? "text-green-400"
            : "text-yellow-400"
        }`}
      >
        {done
          ? "✅ Completed"
          : "⏳ Pending"}
      </p>


      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#182234]">

        <div
          className={`h-full rounded-full transition-all duration-700 ${
            done
              ? "bg-green-500"
              : "bg-yellow-500"
          }`}
          style={{
            width: done
              ? "100%"
              : "20%",
          }}
        />

      </div>

    </div>
  );
}