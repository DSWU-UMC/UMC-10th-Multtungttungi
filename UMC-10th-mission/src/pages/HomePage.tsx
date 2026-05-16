import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [search] = useState("");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const navigate = useNavigate();
  const {
    data: lpList,
    isPending,
    isError,
  } = useGetLpList({ search, order, limit: 20, cursor: undefined });

  if (isPending) {
    return <div className={"mt-20"}>Loading...</div>;
  }

  if (isError) {
    return <div>Error.</div>;
  }

  return (
    <div className="w-full max-w-6xl px-4 py-6 bg-[#0b0b0b] mt-10">
      <div className="flex justify-end mb-6">
        <div className="bg-black p-1 rounded-md flex gap-1 border border-gray-900">
          <button
            onClick={() => setOrder("asc")}
            className={`px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
              order === "asc"
                ? "bg-white text-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder("desc")}
            className={`px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
              order === "desc"
                ? "bg-white text-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {lpList?.map((lp: any) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)}
            className="group relative aspect-square rounded-md bg-[#121212] overflow-hidden border border-gray-900 shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <img
              src={lp.thumbnail || "https://via.placeholder.com/150"}
              alt={lp.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div className="absolute inset-0 bg-black/70 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
              <h3 className="font-bold text-sm text-white line-clamp-2 mb-1">
                {lp.title}
              </h3>

              <div className="flex justify-between items-center w-full mt-1">
                {/* [수정1] lp.lpld → lp.createdAt
                    - `lpld`는 타입에 존재하지 않는 오탈자 → 항상 fallback "17 mins ago" 표시
                    - ResponseLpListDto 타입에서 실제 필드명은 createdAt */}
                <span className="text-[11px] text-gray-400">
                  {lp.createdAt
                    ? new Date(lp.createdAt).toLocaleDateString()
                    : ""}
                </span>

                {/* [수정2] lp.likes ?? 0 → lp.likes?.length ?? 0
                    - lp.likes는 Likes[] 배열 타입이므로 배열을 그대로 렌더링하면 "[object Object]..." 출력
                    - .length로 개수를 표시해야 함 */}
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  ♡ {lp.likes?.length ?? 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HomePage;
