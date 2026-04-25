import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, FileText, BarChart3, Bell, User, BookOpen } from "lucide-react";
import FacultyDashboardHome from "./faculty/FacultyDashboardHome";
import MyForms from "./faculty/MyForms";
import MyReports from "./faculty/MyReports";
import FacultyNotifications from "./faculty/FacultyNotifications";
import FacultyProfile from "./faculty/FacultyProfile";
import FacultyResearchLibrary from "./faculty/FacultyResearchLibrary";

const navItems = [
  { title: "Dashboard", url: "/faculty", icon: LayoutDashboard },
  { title: "My Forms", url: "/faculty/forms", icon: FileText },
  { title: "My Reports", url: "/faculty/reports", icon: BarChart3 },
  { title: "Research Library", url: "/faculty/library", icon: BookOpen },
  { title: "Notifications", url: "/faculty/notifications", icon: Bell },
  { title: "Profile", url: "/faculty/profile", icon: User },
];

const FacultyDashboard = () => (
  <DashboardLayout role="faculty" navItems={navItems}>
    <Routes>
      <Route index element={<FacultyDashboardHome />} />
      <Route path="forms" element={<MyForms />} />
      <Route path="reports" element={<MyReports />} />
      <Route path="library" element={<FacultyResearchLibrary />} />
      <Route path="notifications" element={<FacultyNotifications />} />
      <Route path="profile" element={<FacultyProfile />} />
    </Routes>
  </DashboardLayout>
);

export default FacultyDashboard;
