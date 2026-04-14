import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, FileText, Users, ClipboardList, MessageSquare, Settings } from "lucide-react";
import AdminDashboardHome from "./admin/AdminDashboard";
import CreateForm from "./admin/CreateForm";
import ManageFaculty from "./admin/ManageFaculty";
import Submissions from "./admin/Submissions";
import Messages from "./admin/Messages";
import SettingsPage from "./admin/Settings";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Create Form", url: "/admin/create-form", icon: FileText },
  { title: "Manage Faculty", url: "/admin/faculty", icon: Users },
  { title: "Submissions", url: "/admin/submissions", icon: ClipboardList },
  { title: "Messages", url: "/admin/messages", icon: MessageSquare },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const AdminDashboard = () => (
  <DashboardLayout role="admin" navItems={navItems}>
    <Routes>
      <Route index element={<AdminDashboardHome />} />
      <Route path="create-form" element={<CreateForm />} />
      <Route path="faculty" element={<ManageFaculty />} />
      <Route path="submissions" element={<Submissions />} />
      <Route path="messages" element={<Messages />} />
      <Route path="settings" element={<SettingsPage />} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;
