import AdminCard from "../../components/ui/AdminCard";

export default function AdminDashboard() {

  return (
    <div className="min-h-screen bg-[#0B1120] p-8">

      <h1 className="text-3xl font-bold text-white">
        Admin Portal
      </h1>

      <p className="mt-2 text-gray-400">
        TNHS SERT Management System
      </p>


      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

        <AdminCard
          title="Members"
          value="120"
          description="Registered SERT Members"
        />

        <AdminCard
          title="Training"
          value="85%"
          description="Completion Rate"
        />

        <AdminCard
          title="Announcements"
          value="12"
          description="Active Posts"
        />

        <AdminCard
          title="Quiz Scores"
          value="96%"
          description="Average Score"
        />

      </div>


    </div>
  );
}