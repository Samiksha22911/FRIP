import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">Admin Panel</h2>

      <ul className="menu">
        <li><Link to="/admin/dashboard">📊 Dashboard</Link></li>
        <li><Link to="/admin/create-form">➕ Create Form</Link></li>
        <li><Link to="/admin/faculty">👨‍🏫 Manage Faculty</Link></li>
        <li><Link to="/admin/submissions">📂 Submissions</Link></li>
        <li><Link to="/admin/reports">📈 Reports</Link></li>
        <li><Link to="/admin/messages">💬 Messages</Link></li>
        <li><Link to="/admin/settings">⚙️ Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;