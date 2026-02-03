import { Link } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {

 const user = JSON.parse(localStorage.getItem('user'))
  const role = user?.user?.role

  


  return (
    <div className="admin-sidebar">
      <h2>ADMIN</h2>

      <Link to="/admin/dashboard">📊 Dashboard</Link>
      <Link to="/admin/manage-users">👤 Users</Link>
      <Link to="/admin/manage-products">📦 Products</Link>
      <Link to="/admin/manage-orders">🧾 Orders</Link>
    </div>
  );
}

export default AdminSidebar;
