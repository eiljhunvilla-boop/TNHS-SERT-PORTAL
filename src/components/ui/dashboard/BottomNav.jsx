import {
  House,
  GraduationCap,
  Bell,
  User,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import {
  useAnnouncements,
} from "../../../context/AnnouncementContext";

export default function BottomNav() {
  const member = JSON.parse(
    localStorage.getItem("sertMember")
  );

  const {
    unreadCount,
  } = useAnnouncements();

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
              `relative ${
                isActive
                  ? "text-blue-400"
                  : "text-gray-400"
              }`
            }
          >

            <div className="relative">

              <Icon size={24} />

              {/* Live Notification Badge */}
              {item.path === "/announcements" &&
                unreadCount > 0 && (
                  <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg">

                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}

                  </span>
                )}

            </div>

          </NavLink>
        );
      })}

      {/* Admin Portal */}

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