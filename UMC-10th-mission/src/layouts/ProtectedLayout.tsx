import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const ProtectedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { accessToken } = useAuth();
  const savedToken = localStorage.getItem("accessToken");
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (!accessToken && !savedToken) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-white font-sans">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {isSidebarOpen && <Sidebar />}
        <main className="flex-1 flex items-center justify-center mt-10">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
