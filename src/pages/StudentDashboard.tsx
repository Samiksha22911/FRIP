import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, BookOpen, Sparkles } from "lucide-react";
import StudentDashboardHome from "./student/StudentDashboardHome";
import StudentBrowse from "./student/StudentBrowse";
import FindMentor from "./student/FindMentor";

const navItems = [
  { title: "Dashboard", url: "/student", icon: LayoutDashboard },
  { title: "Browse Publications", url: "/student/browse", icon: BookOpen },
  { title: "Find Mentor", url: "/student/find-mentor", icon: Sparkles },
];

const StudentDashboard = () => (
  <DashboardLayout role="student" navItems={navItems}>
    <Routes>
      <Route index element={<StudentDashboardHome />} />
      <Route path="browse" element={<StudentBrowse />} />
      <Route path="find-mentor" element={<FindMentor />} />
    </Routes>
  </DashboardLayout>
);

export default StudentDashboard;
