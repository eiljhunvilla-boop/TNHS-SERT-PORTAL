function Item(title, done) {
  return (
    <div className="mb-5">

      <div className="mb-2 flex justify-between">

        <span className="text-gray-300">
          {title}
        </span>

        <span className="text-blue-300">
          {done ? "Completed" : "Pending"}
        </span>

      </div>

      <div className="h-2 rounded-full bg-gray-700">

        <div
          className={`h-2 rounded-full ${
            done ? "w-full bg-green-500" : "w-0 bg-blue-500"
          }`}
        />

      </div>

    </div>
  );
}

export default function TrainingCard({ member }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#182234]/70 p-6 backdrop-blur-xl">

      <h2 className="mb-6 text-xl font-bold text-white">
        Training Progress
      </h2>

      {Item("Basic Life Support", member.bls)}

      {Item("Trauma Care", member.trauma)}

      {Item(
        "Carries & Transportation",
        member.carriesTransportation
      )}

    </div>
  );
}