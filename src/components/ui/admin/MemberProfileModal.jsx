import MemberIDCard from "./MemberIDCard";

export default function MemberProfileModal({
  open,
  member,
  onClose,
}) {
  if (!open || !member) return null;

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto p-6">

<div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#182234] p-8 shadow-2xl">

        <div className="grid gap-10 lg:grid-cols-2">

          {/* ================= LEFT SIDE ================= */}

          <div>

            <div className="flex flex-col items-center">

              {/* Profile Photo or Initials */}

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

              <h2 className="mt-6 text-3xl font-bold text-white text-center">
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

            {/* Member Information */}

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
                label="Administrator"
                value={member.isAdmin ? "YES" : "NO"}
              />

              <Info
                label="SERT ID"
                value={member.sertId}
              />

            </div>

            {/* Training Progress */}

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

<div className="flex justify-center overflow-y-auto max-h-[80vh]">
  <MemberIDCard member={member} />
</div>

        </div>

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

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#101B2E] p-4">

      <span className="text-gray-400">
        {label}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>

    </div>
  );
}

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