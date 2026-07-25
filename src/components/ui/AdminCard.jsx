export default function AdminCard({
  title,
  value,
  description
}) {

  return (

    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">

      <h2 className="text-gray-400 text-sm">
        {title}
      </h2>


      <p className="mt-3 text-4xl font-bold text-white">
        {value}
      </p>


      <p className="mt-2 text-gray-500 text-sm">
        {description}
      </p>

    </div>

  );

}