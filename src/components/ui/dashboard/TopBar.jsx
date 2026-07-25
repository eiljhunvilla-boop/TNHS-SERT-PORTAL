import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();

  function handleSignOut() {
    // Remove the logged-in member
    localStorage.removeItem("sertMember");

    // Return to the login page
    navigate("/");
  }

  return (
    <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#182234]/70 p-5 backdrop-blur-xl">

      <div>
        <h1 className="text-xl font-bold text-white">
          TNHS SERT
        </h1>

        <p className="text-sm text-green-400">
          ● Connected
        </p>
      </div>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-red-300 transition hover:bg-red-500/20"
      >
        <LogOut size={18} />
        Sign Out
      </button>

    </header>
  );
}