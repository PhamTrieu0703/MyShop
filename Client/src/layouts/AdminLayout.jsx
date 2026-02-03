import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { Outlet } from "react-router-dom";

function AdminLayout(){
    return(
         <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}
export default AdminLayout;