import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-white font-sans">
      <nav className="p-4 flex justify-between items-center bg-[#0b0b0b] border-b border-gray-900">
        <h1 className="text-[#ff007f] font-bold text-xl cursor-pointer">
          돌려돌려LP판
        </h1>
        <div className="flex gap-4">
          <button
            className="text-sm hover:text-gray-300 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>{" "}
          <button
            className="text-sm bg-[#ff007f] px-3 py-1 rounded-md hover:bg-[#e60073] cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
      <footer className="p-4 text-center text-xs text-gray-600">
        © 2026 돌려돌려LP판.
      </footer>
    </div>
  );
};

export default ProtectedLayout;
