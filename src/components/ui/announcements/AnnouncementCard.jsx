import {
  Pin,
  Megaphone,
  ShieldAlert,
  BookOpen,
  CalendarDays,
  Trash2,
} from "lucide-react";

export default function AnnouncementCard({
  announcement,
  onDelete,
  isAdmin = false,
}) {
  const icon = () => {
    switch (announcement.type) {
      case "Emergency":
        return (
          <ShieldAlert
            className="text-red-400"
            size={24}
          />
        );

      case "Training":
        return (
          <BookOpen
            className="text-green-400"
            size={24}
          />
        );

      case "Meeting":
        return (
          <CalendarDays
            className="text-yellow-400"
            size={24}
          />
        );

      default:
        return (
          <Megaphone
            className="text-blue-400"
            size={24}
          />
        );
    }
  };

  const priorityColor = () => {
    switch (announcement.priority) {
      case "High":
        return "bg-red-500/20 text-red-400";

      case "Low":
        return "bg-green-500/20 text-green-400";

      default:
        return "bg-blue-500/20 text-blue-300";
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#182234]/70 p-6 backdrop-blur-xl">

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          {icon()}

          <div>

            <h2 className="text-lg font-bold text-white">
              {announcement.title}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-2">

              {announcement.type && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                  {announcement.type}
                </span>
              )}

              {announcement.priority && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor()}`}
                >
                  {announcement.priority}
                </span>
              )}

              {announcement.pinned && (
                <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-400">
                  <Pin size={12} />
                  PINNED
                </span>
              )}

            </div>

          </div>

        </div>

        {isAdmin && (
          <button
  onClick={() => onDelete()}
  className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
>
  <Trash2 size={18} />
</button>
        )}

      </div>

      {/* MESSAGE */}

      <p className="mt-6 whitespace-pre-line text-gray-300">
        {announcement.message}
      </p>

      {/* FOOTER */}

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-gray-500">

        <span>
          Posted by{" "}
          <span className="font-medium text-white">
            {announcement.author}
          </span>
        </span>

        <span>{announcement.date}</span>

      </div>

    </div>
  );
}