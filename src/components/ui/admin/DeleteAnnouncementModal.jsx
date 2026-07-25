export default function DeleteAnnouncementModal({
  open,
  announcement,
  onClose,
  onConfirm,
}) {
  if (!open || !announcement) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl bg-[#182234] p-8 shadow-2xl">

        <h2 className="text-2xl font-bold text-white">
          Delete Announcement
        </h2>

        <p className="mt-5 text-gray-300">
          Are you sure you want to delete
        </p>

        <p className="mt-2 font-semibold text-red-400">
          "{announcement.title}"
        </p>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-700 px-5 py-3 text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}