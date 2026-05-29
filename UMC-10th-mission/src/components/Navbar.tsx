import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { useEffect, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth";

interface NavbarProps {
  onToggleSidebar: () => void;
}
const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [myInfo, setMyInfo] = useState<ResponseMyInfoDto | null>(null);
  useEffect(() => {
    if (!accessToken) return;

    const getData = async () => {
      try {
        const response = await getMyInfo();
        setMyInfo(response);
      } catch (e) {
        console.error("사용자 정보 조회 실패", e);
      }
    };

    getData();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="p-4 flex justify-between items-center bg-[#0b0b0b] border-b border-gray-900">
      <div className="flex items-center gap-3">
        <button
          className="text-gray-400 hover:text-white cursor-pointer"
          onClick={onToggleSidebar}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>
      </div>
      <Link to="/">
        <h1 className="text-[#ff007f] font-bold text-xl cursor-pointer">
          돌려돌려LP판
        </h1>
      </Link>
      {!accessToken && (
        <div className="flex gap-4">
          <button
            className="text-sm hover:text-gray-300 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
          <button
            className="text-sm bg-[#ff007f] px-3 py-1 rounded-md hover:bg-[#e60073] cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>
      )}
      {accessToken && (
        <div className="flex gap-4">
          <button
            className="text-sm hover:text-gray-300 cursor-pointer"
            onClick={() => navigate("/my")}
          >
            {myInfo?.data.name}님 환영합니다.
          </button>

          <button
            className="p-2 rounded-lg mt-2 cursor-pointer text-sm font-bold disabled:bg-gray-700 disabled:text-gray-500 enabled:bg-[#ff007f] enabled:text-white hover:enabled:bg-[#e60073]"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
