import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="w-64 bg-[#0b0b0b] border-r border-gray-900 p-6 flex flex-col justify-between min-h-[calc(100vh-73px)]">
      <div className="flex flex-col gap-6">
        <button
          className="flex items-center gap-3 text-sm text-gray-400 hover:text-white cursor-pointer"
          onClick={() => navigate("/search")}
        >
          찾기
        </button>
        <button
          className="flex items-center gap-3 text-sm text-gray-400 hover:text-white cursor-pointer"
          onClick={() => navigate("/my")}
        >
          마이페이지
        </button>
      </div>
      <button
        className="text-xs text-gray-400 hover:text-gray-400 cursor-pointer"
        onClick={() => {}}
      >
        탈퇴하기
      </button>
    </aside>
  );
};

export default Sidebar;
