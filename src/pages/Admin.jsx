import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../components/ui/layout/DashboardLayout";
import { Users, Award, Clock3, Bell } from "lucide-react";
import AddMemberModal from "../components/ui/admin/AddMemberModal";
import DeleteModal from "../components/ui/admin/DeleteModal";
import EditMemberModal from "../components/ui/admin/EditMemberModal";
import MemberProfileModal from "../components/ui/admin/MemberProfileModal";
import AnalyticsCard from "../components/ui/admin/AnalyticsCard";
import { announcements } from "../data/announcements";
import AnnouncementCard from "../components/ui/announcements/AnnouncementCard";
import AddAnnouncementModal from "../components/ui/admin/AddAnnouncementModal";
import {
  subscribeAnnouncements,
  addAnnouncementFirestore,
  deleteAnnouncementFirestore,
} from "../services/announcementService";

import {
  subscribeMembers,
  addMemberFirestore,
  updateMemberFirestore,
  deleteMemberFirestore,
} from "../services/memberService";


function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#182234]/70 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <h2 className="mt-2 text-4xl font-bold text-white">
            {value}
          </h2>
        </div>

        <div className={`rounded-2xl p-4 ${color}`}>
          <Icon className="text-white" size={30} />
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const member = JSON.parse(localStorage.getItem("sertMember"));

const [memberList, setMemberList] = useState([]);

useEffect(() => {
  const unsubscribeMembers = subscribeMembers((members) => {
    setMemberList(members);
  });

  const unsubscribeAnnouncements = subscribeAnnouncements(
    (announcements) => {
      setAnnouncementList(announcements);
    }
  );

  return () => {
    unsubscribeMembers();
    unsubscribeAnnouncements();
  };
}, []);


const [showModal, setShowModal] = useState(false);


const [newMember, setNewMember] = useState({
  name: "",
  birthdate: "",
  sertId: "",
  secretCode: "",
  status: "Active",
  bls: false,
  trauma: false,
  carriesTransportation: false,
  isAdmin: false,
  photo: "",
});

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [memberToDelete, setMemberToDelete] = useState(null);

const [showEditModal, setShowEditModal] = useState(false);
const [editMember, setEditMember] = useState(null);

const [search, setSearch] = useState("");

const [filter, setFilter] = useState("All");

const [showProfile, setShowProfile] = useState(false);

const [selectedMember, setSelectedMember] = useState(null);

const [announcementList, setAnnouncementList] = useState([]);

const [showAnnouncementModal, setShowAnnouncementModal] =
  useState(false);

const [showDeleteAnnouncementModal, setShowDeleteAnnouncementModal] =
  useState(false);

const [announcementToDelete, setAnnouncementToDelete] =
  useState(null);

const [newAnnouncement, setNewAnnouncement] =
  useState({
    title: "",
    message: "",
    priority: "Normal",
    pinned: false,
  });


  if (!member) return <Navigate to="/" replace />;
  if (!member.isAdmin) return <Navigate to="/dashboard" replace />;

const totalMembers = memberList.length;

  const seniors = memberList.filter(
    (m) =>
      m.bls &&
      m.trauma &&
      m.carriesTransportation
  ).length;

const pending = memberList.filter(
    (m) =>
      !(
        m.bls &&
        m.trauma &&
        m.carriesTransportation
      )
  ).length;

const announcementCount = announcementList.length;

  

  const blsCompleted = memberList.filter((m) => m.bls).length;

const traumaCompleted = memberList.filter((m) => m.trauma).length;

const carriesCompleted = memberList.filter(
  (m) => m.carriesTransportation
).length;

const blsPercent = totalMembers
  ? Math.round((blsCompleted / totalMembers) * 100)
  : 0;

const traumaPercent = totalMembers
  ? Math.round((traumaCompleted / totalMembers) * 100)
  : 0;

const carriesPercent = totalMembers
  ? Math.round((carriesCompleted / totalMembers) * 100)
  : 0;

const filteredMembers = memberList.filter((m) => {

  const keyword = search.toLowerCase();

  const rank =
    m.bls &&
    m.trauma &&
    m.carriesTransportation
      ? "Senior"
      : "Neophyte";

  const matchesSearch =
    m.name.toLowerCase().includes(keyword) ||
    m.sertId.toLowerCase().includes(keyword) ||
    m.status.toLowerCase().includes(keyword);

  const matchesFilter =
    filter === "All" ||
    filter === rank ||
    filter === m.status;

  return matchesSearch && matchesFilter;

});

const activeMembers = memberList.filter(
  (m) => m.status === "Active"
).length;

const inactiveMembers = memberList.filter(
  (m) => m.status === "Inactive"
).length;

const seniorMembers = memberList.filter(
  (m) =>
    m.bls &&
    m.trauma &&
    m.carriesTransportation
).length;

const neophytes = memberList.length - seniorMembers;

const admins = memberList.filter(
  (m) => m.isAdmin
).length;

const totalTrainingPercent = Math.round(
  (blsPercent + traumaPercent + carriesPercent) / 3
);

async function addMember() {
if (
  !newMember.name ||
  !newMember.birthdate ||
  !newMember.sertId ||
  !newMember.secretCode
) {
  alert("Please complete all required fields.");
  return;
}

  const memberToAdd = {
    ...newMember,
    name: newMember.name.toUpperCase(),
    sertId: newMember.sertId.toUpperCase(),
    photo: newMember.photo || "",
  };

  await addMemberFirestore(memberToAdd);

  // Reset the form
setNewMember({
  name: "",
  birthdate: "",
  sertId: "",
  secretCode: "",
  status: "Active",
  bls: false,
  trauma: false,
  carriesTransportation: false,
  isAdmin: false,
  photo: "",
});

  // Close the modal
  setShowModal(false);
}

function deleteMember(sertId) {
  const member = memberList.find(
    (m) => m.sertId === sertId
  );

  setMemberToDelete(member);
  setShowDeleteModal(true);
}

async function confirmDelete() {
  if (!memberToDelete) return;

  await deleteMemberFirestore(memberToDelete.sertId);

  // Close the modal
  setShowDeleteModal(false);
  setMemberToDelete(null);
}

async function saveEditedMember() {
  await updateMemberFirestore(editMember.sertId, editMember);

  // Close the modal immediately.
  setShowEditModal(false);
  setEditMember(null);
}

async function publishAnnouncement() {
  if (
    !newAnnouncement.title ||
    !newAnnouncement.message
  ) {
    alert("Please complete all fields.");
    return;
  }

  const announcement = {
    id: Date.now(),
    title: newAnnouncement.title,
    message: newAnnouncement.message,
    priority: newAnnouncement.priority,
    pinned: newAnnouncement.pinned,
    author: member.name,
    createdAt: new Date().toISOString(),
  };

await addAnnouncementFirestore(
  announcement
);



  setNewAnnouncement({
    title: "",
    message: "",
    priority: "Normal",
    pinned: false,
  });

  setShowAnnouncementModal(false);
}

function deleteAnnouncement(announcement) {
  setAnnouncementToDelete(announcement);
  setShowDeleteAnnouncementModal(true);
}

async function confirmDeleteAnnouncement() {
  if (!announcementToDelete) return;

await deleteAnnouncementFirestore(
  announcementToDelete.id
);



  setAnnouncementToDelete(null);
  setShowDeleteAnnouncementModal(false);
}

function cancelDeleteAnnouncement() {
  setAnnouncementToDelete(null);
  setShowDeleteAnnouncementModal(false);
}



  return (
    <DashboardLayout>

      <div className="w-full">

        <h1 className="text-4xl font-bold text-white">
          Admin Portal
        </h1>

        <p className="mt-2 text-gray-400">
          Welcome back, {member.name}
        </p>

        {/* Statistics */}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Members"
            value={totalMembers}
            icon={Users}
            color="bg-blue-600"
          />

          <StatCard
            title="Senior Members"
            value={seniors}
            icon={Award}
            color="bg-green-600"
          />

          <StatCard
            title="Pending Trainings"
            value={pending}
            icon={Clock3}
            color="bg-yellow-500"
          />

<StatCard
  title="Announcements"
  value={announcementList.length}
  icon={Bell}
  color="bg-purple-600"
/>

        </div>

        {/* Members Table */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-[#182234]/70 p-6 backdrop-blur-xl">

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

  <div>

    <h2 className="text-2xl font-bold text-white">
      Members
    </h2>

    <p className="text-gray-400">
      Manage all registered SERT members.
    </p>

  </div>

  <div className="flex flex-col gap-3 md:flex-row">

    <input
      type="text"
      placeholder="Search members..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="rounded-xl bg-[#101B2E] px-4 py-3 text-white outline-none placeholder:text-gray-500"
    />

    <button
      onClick={() => setShowModal(true)}
      className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
    >
      + Add Member
    </button>

  </div>

</div>

<div className="mt-5 flex flex-wrap gap-3">

  {["All", "Senior", "Neophyte", "Active", "Inactive"].map((item) => (

    <button
      key={item}
      onClick={() => setFilter(item)}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
        filter === item
          ? "bg-blue-600 text-white"
          : "bg-[#101B2E] text-gray-300 hover:bg-[#1B2B45]"
      }`}
    >
      {item}
    </button>

  ))}

</div>



          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-white/10">

                <tr>

                  <th className="px-4 py-4 text-left text-gray-400">
                    SERT ID
                  </th>

                  <th className="px-4 py-4 text-left text-gray-400">
                    Name
                  </th>

                  <th className="px-4 py-4 text-left text-gray-400">
                    Rank
                  </th>

                  <th className="px-4 py-4 text-left text-gray-400">
                    Status
                  </th>

                  <th className="px-4 py-4 text-center text-gray-400">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredMembers.map((m) => {

                  const rank =
                    m.bls &&
                    m.trauma &&
                    m.carriesTransportation
                      ? "Senior"
                      : "Neophyte";



                  return (
  <tr
    key={m.sertId}
    className="border-b border-white/5 hover:bg-white/5"
  >
    <td className="whitespace-nowrap px-4 py-5 text-white">
      {m.sertId}
    </td>

<td className="px-4 py-5">

  <button
    onClick={() => {
      setSelectedMember(m);
      setShowProfile(true);
    }}
    className="font-medium text-blue-400 hover:text-blue-300"
  >
    {m.name}
  </button>

</td>

    <td className="px-4 py-5">
      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          rank === "Senior"
            ? "bg-green-500/20 text-green-400"
            : "bg-yellow-500/20 text-yellow-400"
        }`}
      >
        {rank}
      </span>
    </td>

    <td className="px-4 py-5">
      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
        {m.status}
      </span>
    </td>

    <td className="px-4 py-5">
      <div className="flex justify-center gap-2">
       
       <button
  onClick={() => {
    setEditMember({ ...m });
    setShowEditModal(true);
  }}
  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
>
  Edit
</button>

<button
  onClick={() => {
    setMemberToDelete(m);
    setShowDeleteModal(true);
  }}
  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
>
  Delete
</button>

      </div>
    </td>
  </tr>
);

})}

</tbody>

</table>

</div>

</div>

<div className="mt-10 rounded-3xl border border-white/10 bg-[#182234]/70 p-8 backdrop-blur-xl">

  <h2 className="text-2xl font-bold text-white">
    Training Overview
  </h2>

  <p className="mb-8 text-gray-400">
    Overall completion of member trainings.
  </p>

  <ProgressBar
    title="Basic Life Support"
    value={blsPercent}
  />

  <ProgressBar
    title="Trauma Care"
    value={traumaPercent}
  />

  <ProgressBar
    title="Carries & Transportation"
    value={carriesPercent}
  />

</div>

</div>

{/* ================= ADD MEMBER MODAL ================= */}

<ProgressBar
  title="Carries & Transportation"
  value={carriesPercent}
/>

{/* ================= ANNOUNCEMENTS ================= */}

<div className="mt-10 rounded-3xl border border-white/10 bg-[#182234]/70 p-8 backdrop-blur-xl">

<div className="mb-8 flex items-center justify-between">

  <div>

    <h2 className="text-2xl font-bold text-white">
      Announcements
    </h2>

    <p className="text-gray-400">
      Latest updates from TNHS SERT.
    </p>

  </div>

  <button
    onClick={() => setShowAnnouncementModal(true)}
    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
  >
    + New Announcement
  </button>

</div>

  <div className="grid gap-5">

    {announcementList.length === 0 ? (

      <p className="text-center text-gray-500">
        No announcements yet.
      </p>

    ) : (

      announcementList.map((announcement) => (

<AnnouncementCard
  key={announcement.id}
  announcement={announcement}
  onDelete={() => deleteAnnouncement(announcement)}
  isAdmin={true}
/>

      ))

    )}

  </div>

</div>

<AddMemberModal
  open={showModal}
  onClose={() => setShowModal(false)}
  onSave={addMember}
  newMember={newMember}
  setNewMember={setNewMember}
/>

<DeleteModal
  open={showDeleteModal}
  member={memberToDelete}
  onClose={() => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  }}
  onConfirm={confirmDelete}
/>

<EditMemberModal
  open={showEditModal}
  onClose={() => {
    setShowEditModal(false);
    setEditMember(null);
  }}
  onSave={saveEditedMember}
  editMember={editMember}
  setEditMember={setEditMember}
/>

<MemberProfileModal
  open={showProfile}
  member={selectedMember}
  onClose={() => {
    setShowProfile(false);
    setSelectedMember(null);
  }}
/>

<AddAnnouncementModal
  open={showAnnouncementModal}
  onClose={() => setShowAnnouncementModal(false)}
  onSave={publishAnnouncement}
  newAnnouncement={newAnnouncement}
  setNewAnnouncement={setNewAnnouncement}
/>

<DeleteModal
  open={showDeleteAnnouncementModal}
  member={{
    name: announcementToDelete?.title,
  }}
  onClose={cancelDeleteAnnouncement}
  onConfirm={confirmDeleteAnnouncement}
/>


</DashboardLayout>
);
}

function ProgressBar({ title, value }) {
  return (
    <div className="mb-7">

      <div className="mb-2 flex justify-between">

        <span className="text-white">
          {title}
        </span>

        <span className="text-blue-300">
          {value}%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-[#101B2E]">

        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-700"
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  );
}