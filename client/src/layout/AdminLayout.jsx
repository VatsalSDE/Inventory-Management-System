// ---------------------------------------------------------------- All Imports ----------------------------------------------------------------

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar.jsx";
import TopBar from "../components/common/TopBar.jsx";

// ---------------------------------------------------------------- Admin Layout Component ----------------------------------------------------------------

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <div className="w-full h-screen bg-[#F5F5F5] flex overflow-hidden relative">
      {/* ---------------------------------------------------------------- Sidebar Section  (Desktop: always visible, Mobile/Tablet: toggle ) ---------------------------------------------------------------- */}

      <div className="hidden lg:block fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      {/* ---------------------------------------------------------------- Sidebar Drawer for Mobile/Tablet ---------------------------------------------------------------- */}
      {isSidebarOpen && (
        <>
          <div className="fixed top-0 left-0 z-[60] w-[260px] h-full bg-gradient-to-b from-secondary to-primary text-white lg:hidden transition-transform duration-300">
            <Sidebar onClose={closeSidebar} />{" "}
          </div>

          <div
            className="fixed inset-0 bg-black opacity-50 z-[50] lg:hidden"
            onClick={closeSidebar}
          />
        </>
      )}

      {/* ---------------------------------------------------------------- Main Content Area ---------------------------------------------------------------- */}

      <main className="flex-1 flex flex-col lg:ml-[325px] h-full overflow-hidden">
        {/* ---------------------------------------------------------------- Top Bar Section ---------------------------------------------------------------- */}

        <header className="flex items-center justify-between h-[70px] w-full mobile:h-[80px] desktop:h-[100px]  shrink-0">
          <TopBar onToggleSidebar={toggleSidebar} />
        </header>

        {/* ---------------------------------------------------------------- Page Content Outlet ---------------------------------------------------------------- */}
        <div className="flex-1 overflow-auto p-0 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// ---------------------------------------------------------------- Export ----------------------------------------------------------------

export default AdminLayout;
