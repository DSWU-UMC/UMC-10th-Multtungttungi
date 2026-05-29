import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpDetail } from "../../apis/lp";

interface UseGetLpDetailProps {
  lpid: string | undefined;
}

function useGetLpDetail({ lpid }: UseGetLpDetailProps) {
  const accessToken = localStorage.getItem("accessToken");
  return useQuery({
    queryKey: [QUERY_KEY.lps, "detail", lpid],

    queryFn: () => getLpDetail(lpid!),

    staleTime: 1000 * 60 * 5, // 5분 동안 신선한 데이터로 간주해 네트워크 요청 절약
    gcTime: 1000 * 60 * 10, // 10분 동안 비활성화 상태여도 메모리에 보관

    enabled:
      Boolean(lpid) &&
      Boolean(accessToken) &&
      accessToken !== "null" &&
      accessToken !== "undefined",

    select: (data) => data.data,
  });
}

export default useGetLpDetail;
