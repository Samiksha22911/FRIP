import ProfilePage from "@/components/ProfilePage";

const HodProfile = () => (
  <ProfilePage
    role="hod"
    defaults={{
      name: "Dr. R. Verma",
      email: "hod.ece@fri.edu",
      institute: "Faculty Research Institute",
      department: "Electronics & Communication Engineering",
      designation: "Head of Department",
      phone: "+91 99000 22222",
      employeeId: "FRI-HOD-ECE-01",
    }}
    summary={[
      { label: "Department Faculty", value: 32 },
      { label: "Approved Reports", value: 187 },
      { label: "My Publications", value: 11 },
    ]}
  />
);

export default HodProfile;
