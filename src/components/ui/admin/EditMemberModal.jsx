export default function EditMemberModal({
  open,
  onClose,
  onSave,
  editMember,
  setEditMember,
}) {
  if (!open || !editMember) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#182234] p-8 shadow-2xl">

        <h2 className="mb-8 text-3xl font-bold text-white">
          Edit Member
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-gray-300">
              Full Name
            </label>

            <input
              className="w-full rounded-xl bg-[#101B2E] p-3 text-white outline-none"
              value={editMember.name}
              onChange={(e) =>
                setEditMember({
                  ...editMember,
                  name: e.target.value.toUpperCase(),
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-300">
              SERT ID
            </label>

            <input
              className="w-full rounded-xl bg-[#101B2E] p-3 text-white outline-none"
              value={editMember.sertId}
              onChange={(e) =>
                setEditMember({
                  ...editMember,
                  sertId: e.target.value.toUpperCase(),
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-300">
              Secret Code
            </label>

            <input
              className="w-full rounded-xl bg-[#101B2E] p-3 text-white outline-none"
              value={editMember.secretCode}
              onChange={(e) =>
                setEditMember({
                  ...editMember,
                  secretCode: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-300">
              Status
            </label>

            <select
              className="w-full rounded-xl bg-[#101B2E] p-3 text-white"
              value={editMember.status}
              onChange={(e) =>
                setEditMember({
                  ...editMember,
                  status: e.target.value,
                })
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

        </div>

        <div className="mt-8 space-y-3">

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={editMember.bls}
              onChange={(e) =>
                setEditMember({
                  ...editMember,
                  bls: e.target.checked,
                })
              }
            />
            Basic Life Support
          </label>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={editMember.trauma}
              onChange={(e) =>
                setEditMember({
                  ...editMember,
                  trauma: e.target.checked,
                })
              }
            />
            Trauma Care
          </label>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={editMember.carriesTransportation}
              onChange={(e) =>
                setEditMember({
                  ...editMember,
                  carriesTransportation: e.target.checked,
                })
              }
            />
            Carries & Transportation
          </label>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={editMember.isAdmin}
              onChange={(e) =>
                setEditMember({
                  ...editMember,
                  isAdmin: e.target.checked,
                })
              }
            />
            Administrator
          </label>

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}