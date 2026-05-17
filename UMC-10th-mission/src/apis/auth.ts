import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (
  body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (
  body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  // [수정1] 수동 토큰 주입 제거 → 인터셉터에 위임
  //   - 기존 코드는 localStorage를 직접 읽어 Authorization 헤더를 중복 설정
  //   - axios.ts 인터셉터가 이미 모든 요청에 토큰을 자동으로 추가하므로 중복 불필요
  //   - 인터셉터 로직 변경 시 이 함수만 누락되는 불일치 위험 제거
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};
