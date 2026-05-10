import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>();
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div>
      <h1>{data?.data?.name}님 환영합니다.</h1>
      <h1>{data?.data?.email}</h1>
      <button
        className="w-full p-3 rounded-lg mt-2 cursor-pointer text-sm font-bold disabled:bg-gray-700 disabled:text-gray-500 enabled:bg-[#ff007f] enabled:text-white hover:enabled:bg-[#e60073]"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
