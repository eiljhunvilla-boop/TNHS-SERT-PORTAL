export default function AnalyticsCard({
  title,
  value,
  subtitle,
  color,
}) {
  return (
    <div
      className={`rounded-3xl border border-white/10 p-6 shadow-xl ${color}`}
    >
      <p className="text-sm text-white/80">
        {title}
      </p>

      <h2 className="mt-3 text-5xl font-bold text-white">
        {value}
      </h2>

      <p className="mt-2 text-sm text-white/70">
        {subtitle}
      </p>
    </div>
  );
}