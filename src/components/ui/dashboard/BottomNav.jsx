import {
  House,
  GraduationCap,
  Bell,
  User,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const member = JSON.parse(localStorage.getItem("sertMember"));

  const menu = [
    {
      icon: House,
      path: "/dashboard",
    },
    {
      icon: GraduationCap,
      path: "/training",
    },
    {
      icon: Bell,
      path: "/announcements",
    },
    {
      icon: User,
      path: "/profile",
    },
    {
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-white/10 bg-[#182234]/95 py-3 backdrop-blur-xl">

      {menu.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "text-blue-400"
                : "text-gray-400"
            }
          >
            <Icon size={24} />
          </NavLink>
        );
      })}

      {member?.isAdmin && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive
              ? "text-emerald-400"
              : "text-gray-400"
          }
        >
          <ShieldCheck size={24} />
        </NavLink>
      )}

    </nav>
  );
}