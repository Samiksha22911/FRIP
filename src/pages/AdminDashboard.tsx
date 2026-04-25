import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, FileText, Users, ClipboardList, MessageSquare, Settings, BookOpen, User, FilePlus } from "lucide-react";
import AdminDashboardHome from "./admin/AdminDashboard";
import CreateForm from "./admin/CreateForm";
import ManageFaculty from "./admin/ManageFaculty";
import Submissions from "./admin/Submissions";
import Messages from "./admin/Messages";
import SettingsPage from "./admin/Settings";
import AdminResearch from "./admin/AdminResearch";
import AdminProfile from "./admin/AdminProfile";
import BuiltInForms from "./admin/BuiltInForms";

const MitsLogo = () => (
  <img src="/mits-logo.png" alt="MITS Logo" className="w-5 h-5" />
);

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Built-in Forms", url: "/admin/built-in-forms", icon: FilePlus },
  { title: "Create Form", url: "/admin/create-form", icon: FileText },
  { title: "Manage Faculty", url: "/admin/faculty", icon: Users },
  { title: "Submissions", url: "/admin/submissions", icon: ClipboardList },
  { title: "Research Library", url: "/admin/research", icon: BookOpen },
  { title: "Messages", url: "/admin/messages", icon: MessageSquare },
  { title: "Profile", url: "/admin/profile", icon: User },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const AdminDashboard = () => (
  <DashboardLayout role="admin" navItems={navItems}>
    <Routes>
      <Route index element={<AdminDashboardHome />} />
      <Route path="built-in-forms" element={<BuiltInForms />} />
      <Route path="create-form" element={<CreateForm />} />
      <Route path="faculty" element={<ManageFaculty />} />
      <Route path="submissions" element={<Submissions />} />
      <Route path="research" element={<AdminResearch />} />
      <Route path="messages" element={<Messages />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="settings" element={<SettingsPage />} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;
