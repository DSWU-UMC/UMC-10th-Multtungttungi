import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  /*const {
    data: lpList,
    isPending,
    isError,
  } = useGetLpList({ search, order, limit: 50, cursor: undefined });*/

  const {
    data: lpList,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(5, search, order);

  // ref, inView
  // ref -> 특정한 HTML요소를 감시할 수 있다.
  // inView -> 그 요소가 화면에 보이면 true
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending) {
    return <div className={"mt-20"}>Loading...</div>;
  }

  if (isError) {
    return <div>Error.</div>;
  }

  return (
    <div className="w-full max-w-6xl px-4 py-6 bg-[#0b0b0b] mt-10">
      <input value={search} onChange={(e) => setSearch(e.target.value)} />

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
        {isPending && <LpCardSkeletonList count={10} />}
        {lpList?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref} className="h-2"></div>
    </div>
  );
};
export default HomePage;
