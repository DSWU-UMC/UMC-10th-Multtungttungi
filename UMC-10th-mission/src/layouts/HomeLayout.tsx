import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-white font-sans">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {isSidebarOpen && <Sidebar />}
        <main className="flex-1 flex items-center justify-center mt-10">
          <Outlet />
        </main>
      </div>
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-10 right-10 w-12 h-12 bg-[#ff007f] hover:bg-[#e60073] text-white font-bold text-2xl rounded-full flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer z-50"
      >
        +
      </button>
      <Footer />
    </div>
  );
};

export default HomeLayout;
