import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Training from "./pages/Training";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MigrateMembers from "./pages/MigrateMembers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/admin" element={<Admin />} />

      <Route path="/training" element={<Training />} />

      <Route
        path="/announcements"
        element={<Announcements />}
      />

      <Route path="/profile" element={<Profile />} />

      <Route path="/settings" element={<Settings />} />

      <Route path="/migrate" element={<MigrateMembers />}
/>

    </Routes>
  );
}

export default App;