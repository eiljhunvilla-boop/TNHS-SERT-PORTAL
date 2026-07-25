export default function PrimaryButton({
  children,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
      mt-8
      w-full
      rounded-xl
      bg-gradient-to-r
      from-blue-600
      to-blue-500
      py-3
      font-semibold
      text-white
      transition-all
      duration-300
      hover:scale-[1.02]
      hover:shadow-[0_0_30px_rgba(59,130,246,.45)]
      active:scale-95
      "
    >
      {children}
    </button>
  );
}