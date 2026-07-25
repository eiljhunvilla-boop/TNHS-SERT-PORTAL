export default function ProfileCard({ member }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#182234]/70 p-6 backdrop-blur-xl">

      <div className="flex items-center gap-5">

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
          {member.name
  .split(" ")
  .map((n) => n[0])
  .slice(0, 2)
  .join("")}
        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">
            {member.name}
          </h2>

          <p className="text-gray-400">
            {member.sertId}
          </p>

          <p className="mt-2 text-blue-300">
            Welcome back, responder.
          </p>

        </div>

      </div>

    </div>
  );
}