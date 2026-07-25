import DashboardLayout from "../components/ui/layout/DashboardLayout";

import TopBar from "../components/ui/dashboard/TopBar";
import ProfileCard from "../components/ui/dashboard/ProfileCard";
import StatusCard from "../components/ui/dashboard/StatusCard";
import TrainingCard from "../components/ui/dashboard/TrainingCard";
import AnnouncementCard from "../components/ui/dashboard/AnnouncementCard";
import BottomNav from "../components/ui/dashboard/BottomNav";

export default function Dashboard() {

  const member =
    JSON.parse(localStorage.getItem("sertMember")) || {
      name: "Demo User",
      sertId: "TNHS-SERT-26001",
      bls: false,
      trauma: false,
      carriesTransportation: false,
    };

  return (

    <DashboardLayout>

    <div className="mx-auto w-full max-w-6xl py-8">

        <TopBar />

        <div className="mt-8 grid gap-6">

          <ProfileCard member={member} />

          <StatusCard member={member} />

          <TrainingCard member={member} />

          <AnnouncementCard />

        </div>

      </div>

      <BottomNav />

    </DashboardLayout>

  );

}