import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto>();
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, []);
  return (
    <div>
      이름: {data.data.name} <br />
      이메일: {data.data.email} <br />
    </div>
  );
};

export default MyPage;
