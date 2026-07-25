export default function StatusCard({ member }) {

  const rank =
    member.bls &&
    member.trauma &&
    member.carriesTransportation
      ? "Senior"
      : "Neophyte";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#182234]/70 p-6 backdrop-blur-xl">

      <h2 className="mb-5 text-xl font-bold text-white">
        Member Status
      </h2>

      <div className="flex justify-between">

        <div>

          <p className="text-gray-400">
            Current Rank
          </p>

          <h3 className="text-xl font-bold text-white">
            {rank}
          </h3>

        </div>

        <div>

          <p className="text-gray-400">
            Status
          </p>

          <h3 className="text-green-400">
            Active
          </h3>

        </div>

      </div>

    </div>
  );
}