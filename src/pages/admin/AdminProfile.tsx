import ProfilePage from "@/components/ProfilePage";

const AdminProfile = () => (
  <ProfilePage
    role="admin"
    defaults={{
      name: "Admin User",
      email: "admin@fri.edu",
      institute: "Faculty Research Institute",
      department: "Administration",
      designation: "Portal Administrator",
      phone: "+91 90000 11111",
      employeeId: "FRI-ADM-001",
    }}
    summary={[
      { label: "Faculty", value: 248 },
      { label: "Departments", value: 12 },
      { label: "Forms", value: 18 },
    ]}
  />
);

export default AdminProfile;
