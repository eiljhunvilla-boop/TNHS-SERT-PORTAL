export default function AddAnnouncementModal({
  open,
  onClose,
  onSave,
  newAnnouncement,
  setNewAnnouncement,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl bg-[#182234] p-8 shadow-2xl">

        <h2 className="mb-8 text-3xl font-bold text-white">
          New Announcement
        </h2>

        {/* TITLE */}

        <div className="mb-5">

          <label className="mb-2 block text-gray-300">
            Title
          </label>

          <input
            className="w-full rounded-xl bg-[#101B2E] p-3 text-white outline-none"
            value={newAnnouncement.title}
            onChange={(e)=>
              setNewAnnouncement({
                ...newAnnouncement,
                title:e.target.value,
              })
            }
          />

        </div>

        {/* MESSAGE */}

        <div className="mb-5">

          <label className="mb-2 block text-gray-300">
            Message
          </label>

          <textarea
            rows={6}
            className="w-full rounded-xl bg-[#101B2E] p-3 text-white outline-none"
            value={newAnnouncement.message}
            onChange={(e)=>
              setNewAnnouncement({
                ...newAnnouncement,
                message:e.target.value,
              })
            }
          />

        </div>

        {/* PRIORITY */}

        <div className="mb-5">

          <label className="mb-2 block text-gray-300">
            Priority
          </label>

          <select
            className="w-full rounded-xl bg-[#101B2E] p-3 text-white"
            value={newAnnouncement.priority}
            onChange={(e)=>
              setNewAnnouncement({
                ...newAnnouncement,
                priority:e.target.value,
              })
            }
          >
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>

        </div>

        {/* PIN */}

        <label className="flex items-center gap-3 text-white">

          <input
            type="checkbox"
            checked={newAnnouncement.pinned}
            onChange={(e)=>
              setNewAnnouncement({
                ...newAnnouncement,
                pinned:e.target.checked,
              })
            }
          />

          Pin this announcement

        </label>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-700 px-5 py-3 text-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            Publish
          </button>

        </div>

      </div>

    </div>
  );
}