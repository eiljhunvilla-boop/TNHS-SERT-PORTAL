import {
  House,
  GraduationCap,
  Bell,
  User,
} from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-6 left-1/2 flex -translate-x-1/2 gap-8 rounded-full border border-white/10 bg-[#182234]/90 px-8 py-4 backdrop-blur-xl">

      <House className="text-blue-400" />

      <GraduationCap className="text-gray-400" />

      <Bell className="text-gray-400" />

      <User className="text-gray-400" />

    </nav>
  );
}