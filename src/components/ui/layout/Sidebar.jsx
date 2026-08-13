import {
  House,
  GraduationCap,
  Bell,
  User,
  Settings,
  Shield,
  ShieldCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import logo from "../../../assets/images/sert-logo.jpg";

import {
  useAnnouncements,
} from "../../../context/AnnouncementContext";

export default function Sidebar() {
  const member = JSON.parse(
    localStorage.getItem("sertMember")
  );

  const {
    unreadCount,
  } = useAnnouncements();

  const menu = [
    {
      name: "Dashboard",
      icon: House,
      path: "/dashboard",
    },
    {
      name: "Training",
      icon: GraduationCap,
      path: "/training",
    },
    {
      name: "Announcements",
      icon: Bell,
      path: "/announcements",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-[#0B1527]/80 backdrop-blur-xl">

      {/* Logo */}

      <div className="p-8">

        <img
          src={logo}
          alt="SERT Logo"
          className="mx-auto h-24 w-24 rounded-full border-4 border-blue-500"
        />

        <h1 className="mt-5 text-center text-2xl font-bold text-white">
          TNHS SERT
        </h1>

        <p className="text-center text-gray-400">
          Member Portal
        </p>

      </div>

      {/* Navigation */}

      <nav className="mt-6 flex-1 px-4">

        {menu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >

              <div className="relative">

                <Icon size={20} />

                {/* ========================= */}
                {/* LIVE NOTIFICATION BADGE */}
                {/* ========================= */}

                {item.path === "/announcements" &&
                  unreadCount > 0 && (

                    <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg">

                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}

                    </span>

                  )}

              </div>

              {item.name}

            </NavLink>

          );

        })}

        {/* Admin Portal */}

        {member?.isAdmin && (

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `mt-4 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-300 hover:bg-emerald-500/10"
              }`
            }
          >

            <ShieldCheck size={20} />

            Admin Portal

          </NavLink>

        )}

      </nav>

      {/* Footer */}

      <div className="border-t border-white/10 p-6">

        <div className="flex items-center gap-3">

          <Shield className="text-blue-400" />

          <div>

            <p className="text-sm text-white">
              Secure Portal
            </p>

            <p className="text-xs text-gray-500">
              Version 1.0
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}