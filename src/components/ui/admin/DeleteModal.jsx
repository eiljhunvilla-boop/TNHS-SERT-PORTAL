import { AlertTriangle } from "lucide-react";

export default function DeleteMemberModal({
  open,
  onClose,
  onConfirm,
  member,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#182234] p-8 shadow-2xl">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <AlertTriangle
            size={34}
            className="text-red-400"
          />
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Delete Member
        </h2>

        <p className="mt-4 text-center text-gray-300">
          Are you sure you want to delete
        </p>

        <p className="mt-2 text-center text-lg font-semibold text-blue-300">
          {member?.name}
        </p>

        <p className="mt-2 text-center text-sm text-gray-500">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex gap-4">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-700 py-3 font-semibold text-white transition hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}