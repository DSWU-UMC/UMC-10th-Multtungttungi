import { useParams, useNavigate, useLocation } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { accessToken } = useAuth();
  const isLoggedIn = !!accessToken;
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  const { data: lp, isPending, isError } = useGetLpDetail({ lpid });

  if (isPending) {
    return <div className={"mt-20"}>Loading...</div>;
  }

  if (isError) {
    return <div>Error.</div>;
  }

  return (
    <div className="w-full max-w-3xl px-6 py-8 flex justify-center">
      <div className="w-full bg-[#15161a] rounded-2xl p-8 border border-gray-900 shadow-2xl relative text-left">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-200">
              {lp?.nickname || "익명회원"}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {lp?.createdAt || "1일 전"}
          </span>
        </div>

        <div className="flex justify-between items-start mb-8">
          <h1 className="text-xl font-bold text-white">{lp?.title}</h1>
          <div className="flex gap-2 text-gray-500">
            <button className="hover:text-white cursor-pointer text-sm p-1">
              ✏️
            </button>
            <button className="hover:text-red-400 cursor-pointer text-sm p-1">
              🗑️
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-64 h-64 bg-[#1e1f24] rounded-xl flex items-center justify-center shadow-inner border border-gray-800 group">
            <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-black/50 shadow-2xl relative animate-[spin_20s_linear_infinite] group-hover:[animation-play-state:paused]">
              <img
                src={lp?.thumbnail || "https://via.placeholder.com/300"}
                alt={lp?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 m-auto w-10 h-10 bg-white border-4 border-black/80 rounded-full shadow-md"></div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 leading-relaxed text-center max-w-lg mx-auto mb-8 border-b border-gray-900 pb-6">
          {lp?.content || "이 LP판에 등록된 상세 설명이 없습니다."}
        </div>

        <div className="flex justify-center items-center">
          <button className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 rounded-full border border-gray-900 text-[#ff007f] font-semibold text-sm transition-all cursor-pointer">
            ♥{" "}
            <span className="text-gray-300 text-xs">{lp?.likesCount ?? 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;
