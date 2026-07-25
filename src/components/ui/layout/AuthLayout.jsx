export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#08111F] via-[#0B1527] to-[#111827]">

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
          linear-gradient(to right, white 1px, transparent 1px),
          linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="absolute left-[-200px] top-[-150px] h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[120px]" />

      <div className="absolute bottom-[-180px] right-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[120px]" />

  <div className="relative z-10 flex min-h-screen justify-center p-6">
        
        <div className="w-full">
    {children}
</div>

      </div>

    </div>
  );
}