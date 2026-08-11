import MemberIDCard from "./MemberIDCard";
import { calculateAge } from "../../../utils/calculateAge";

export default function MemberProfileModal({
  open,
  member,
  onClose,
}) {
  if (!open || !member) return null;

  const age = calculateAge(member.birthdate);

  const rank =
    member.bls &&
    member.trauma &&
    member.carriesTransportation
      ? "Senior"
      : "Neophyte";

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/70 p-6 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/10 bg-[#182234] p-8 shadow-2xl">

        <div className="grid gap-10 lg:grid-cols-2">

          {/* ================= LEFT SIDE ================= */}

          <div>

            {/* Profile Header */}

            <div className="flex flex-col items-center">

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

              <h2 className="mt-6 text-center text-3xl font-bold text-white">
                {member.name}
              </h2>

              <p className="mt-2 text-gray-400">
                {member.sertId}
              </p>

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

            {/* ================= MEMBER INFORMATION ================= */}

            <div className="mt-10 grid gap-4">

              <Info
                label="Status"
                value={member.status}
              />

              <Info
                label="Rank"
                value={rank}
              />

              <Info
                label="Birthdate"
                value={
                  member.birthdate
                    ? new Date(
                        member.birthdate + "T00:00:00"
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not provided"
                }
              />

              <Info
                label="Age"
                value={
                  age !== ""
                    ? `${age} years old`
                    : "Not provided"
                }
              />

              {/* CONTACT NUMBER */}

              <Info
                label="Contact Number"
                value={
                  member.contactNumber ||
                  "Not provided"
                }
              />

              {/* ADDRESS */}

              <Info
                label="Address"
                value={
                  member.address ||
                  "Not provided"
                }
              />

              <Info
                label="Administrator"
                value={member.isAdmin ? "YES" : "NO"}
              />

              <Info
                label="SERT ID"
                value={member.sertId}
              />

            </div>

            {/* ================= TRAINING PROGRESS ================= */}

            <div className="mt-10">

              <h3 className="mb-5 text-xl font-semibold text-white">
                Training Progress
              </h3>

              <TrainingBar
                title="Basic Life Support"
                done={member.bls}
              />

              <TrainingBar
                title="Trauma Care"
                done={member.trauma}
              />

              <TrainingBar
                title="Carries & Transportation"
                done={member.carriesTransportation}
              />

            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="flex max-h-[80vh] justify-center overflow-y-auto">
            <MemberIDCard member={member} />
          </div>

        </div>

        {/* CLOSE BUTTON */}

        <button
          onClick={onClose}
          className="mt-10 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Close
        </button>

      </div>

    </div>
  );
}


/* ================= INFO COMPONENT ================= */

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#101B2E] p-4">

      <span className="shrink-0 text-gray-400">
        {label}
      </span>

      <span className="break-words text-right font-semibold text-white">
        {value}
      </span>

    </div>
  );
}


/* ================= TRAINING BAR ================= */

function TrainingBar({ title, done }) {
  return (
    <div className="mb-5">

      <div className="mb-2 flex justify-between">

        <span className="text-white">
          {title}
        </span>

        <span
          className={
            done
              ? "font-semibold text-green-400"
              : "font-semibold text-yellow-400"
          }
        >
          {done ? "Completed" : "Pending"}
        </span>

      </div>

      <div className="h-3 rounded-full bg-[#101B2E]">

        <div
          className={`h-full rounded-full transition-all duration-700 ${
            done
              ? "bg-green-500"
              : "bg-yellow-500"
          }`}
          style={{
            width: done ? "100%" : "20%",
          }}
        />

      </div>

    </div>
  );
}