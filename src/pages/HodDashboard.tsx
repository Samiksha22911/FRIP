import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, ClipboardList, BarChart3, MessageSquare, BookOpen, User } from "lucide-react";
import HodDashboardHome from "./hod/HodDashboardHome";
import FacultyList from "./hod/FacultyList";
import HodSubmissions from "./hod/HodSubmissions";
import HodReports from "./hod/HodReports";
import HodMessages from "./hod/HodMessages";
import HodMyResearch from "./hod/HodMyResearch";
import HodProfile from "./hod/HodProfile";

const navItems = [
  { title: "Dashboard", url: "/hod", icon: LayoutDashboard },
  { title: "Faculty List", url: "/hod/faculty", icon: Users },
  { title: "Submissions", url: "/hod/submissions", icon: ClipboardList },
  { title: "My Research", url: "/hod/my-research", icon: BookOpen },
  { title: "Reports", url: "/hod/reports", icon: BarChart3 },
  { title: "Messages", url: "/hod/messages", icon: MessageSquare },
  { title: "Profile", url: "/hod/profile", icon: User },
];

const HodDashboard = () => (
  <DashboardLayout role="hod" navItems={navItems}>
    <Routes>
      <Route index element={<HodDashboardHome />} />
      <Route path="faculty" element={<FacultyList />} />
      <Route path="submissions" element={<HodSubmissions />} />
      <Route path="my-research" element={<HodMyResearch />} />
      <Route path="reports" element={<HodReports />} />
      <Route path="messages" element={<HodMessages />} />
      <Route path="profile" element={<HodProfile />} />
    </Routes>
  </DashboardLayout>
);

export default HodDashboard;
