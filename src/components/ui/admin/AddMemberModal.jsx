export default function AddMemberModal({
  open,
  onClose,
  onSave,
  newMember,
  setNewMember,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#182234] p-8 shadow-2xl">

        <h2 className="mb-8 text-3xl font-bold text-white">
          Add New Member
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Full Name */}

          <div>

            <label className="mb-2 block text-gray-300">
              Full Name
            </label>

            <input
              className="w-full rounded-xl bg-[#101B2E] p-3 text-white outline-none"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  name: e.target.value.toUpperCase(),
                })
              }
            />

          </div>

          {/* Birthdate */}

<div>
  <label className="mb-2 block text-gray-300">
    Birthdate
  </label>

  <input
    type="date"
    className="w-full rounded-xl bg-[#101B2E] p-3 text-white outline-none"
    value={newMember.birthdate || ""}
    onChange={(e) =>
      setNewMember({
        ...newMember,
        birthdate: e.target.value,
      })
    }
  />
</div>

          {/* SERT ID */}

          <div>

            <label className="mb-2 block text-gray-300">
              SERT ID
            </label>

            <input
              className="w-full rounded-xl bg-[#101B2E] p-3 text-white outline-none"
              value={newMember.sertId}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  sertId: e.target.value.toUpperCase(),
                })
              }
            />

          </div>

          {/* Secret Code */}

          <div>

            <label className="mb-2 block text-gray-300">
              Secret Code
            </label>

            <input
              className="w-full rounded-xl bg-[#101B2E] p-3 text-white outline-none"
              value={newMember.secretCode}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  secretCode: e.target.value,
                })
              }
            />

          </div>

          {/* Status */}

          <div>

            <label className="mb-2 block text-gray-300">
              Status
            </label>

            <select
              className="w-full rounded-xl bg-[#101B2E] p-3 text-white"
              value={newMember.status}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  status: e.target.value,
                })
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

          </div>

          {/* Profile Photo */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-gray-300">
              Profile Photo
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full rounded-xl bg-[#101B2E] p-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
              onChange={(e) => {
                const file = e.target.files[0];

                if (!file) return;

                const reader = new FileReader();

                reader.onloadend = () => {
                  setNewMember({
                    ...newMember,
                    photo: reader.result,
                  });
                };

                reader.readAsDataURL(file);
              }}
            />

          </div>

          {/* Photo Preview */}

          {newMember.photo && (

            <div className="md:col-span-2 flex justify-center">

              <img
                src={newMember.photo}
                alt="Preview"
                className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover shadow-lg"
              />

            </div>

          )}

        </div>

        {/* Trainings */}

        <div className="mt-8 space-y-3">

          <label className="flex items-center gap-3 text-white">

            <input
              type="checkbox"
              checked={newMember.bls}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  bls: e.target.checked,
                })
              }
            />

            Basic Life Support

          </label>

          <label className="flex items-center gap-3 text-white">

            <input
              type="checkbox"
              checked={newMember.trauma}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  trauma: e.target.checked,
                })
              }
            />

            Trauma Care

          </label>

          <label className="flex items-center gap-3 text-white">

            <input
              type="checkbox"
              checked={newMember.carriesTransportation}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  carriesTransportation: e.target.checked,
                })
              }
            />

            Carries & Transportation

          </label>

          <label className="flex items-center gap-3 text-white">

            <input
              type="checkbox"
              checked={newMember.isAdmin}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  isAdmin: e.target.checked,
                })
              }
            />

            Administrator

          </label>

        </div>

        {/* Buttons */}

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-700 px-5 py-3 text-white transition hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Save Member
          </button>

        </div>

      </div>

    </div>
  );
}