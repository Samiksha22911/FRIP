import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, ClipboardList, BarChart3, MessageSquare } from "lucide-react";
import HodDashboardHome from "./hod/HodDashboardHome";
import FacultyList from "./hod/FacultyList";
import HodSubmissions from "./hod/HodSubmissions";
import HodReports from "./hod/HodReports";
import HodMessages from "./hod/HodMessages";

const navItems = [
  { title: "Dashboard", url: "/hod", icon: LayoutDashboard },
  { title: "Faculty List", url: "/hod/faculty", icon: Users },
  { title: "Submissions", url: "/hod/submissions", icon: ClipboardList },
  { title: "Reports", url: "/hod/reports", icon: BarChart3 },
  { title: "Messages", url: "/hod/messages", icon: MessageSquare },
];

const HodDashboard = () => (
  <DashboardLayout role="hod" navItems={navItems}>
    <Routes>
      <Route index element={<HodDashboardHome />} />
      <Route path="faculty" element={<FacultyList />} />
      <Route path="submissions" element={<HodSubmissions />} />
      <Route path="reports" element={<HodReports />} />
      <Route path="messages" element={<HodMessages />} />
    </Routes>
  </DashboardLayout>
);

export default HodDashboard;
