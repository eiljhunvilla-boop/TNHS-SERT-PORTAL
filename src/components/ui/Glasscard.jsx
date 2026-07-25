export default function GlassCard({ children }) {
  return (
    <div
      className="
      relative
      w-full
      rounded-3xl
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      shadow-[0_20px_80px_rgba(0,0,0,.45)]
      "
    >
      {children}
    </div>
  );
}