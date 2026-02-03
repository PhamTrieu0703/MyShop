import { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar/LeftSidebar";
import "./SidebarLayout.css";

function SidebarLayout() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(null);

  return (
    <div className="sidebar-layout">
      {/* LEFT SIDEBAR */}
      <LeftSidebar
        onSearch={setSearch}
        onSelectCategory={setCategoryId}
      />

      {/* MAIN CONTENT */}
      <div className="sidebar-content">
        <Outlet context={{ search, categoryId }} />
      </div>
    </div>
  );
}

export default SidebarLayout;
