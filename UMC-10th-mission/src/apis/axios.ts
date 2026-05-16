import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

// [수정1] useLocalStorage import 제거
//   - React Hook은 컴포넌트/커스텀 Hook 내부에서만 호출 가능 (Rules of Hooks)
//   - Axios 인터셉터 콜백은 일반 함수이므로 Hook 호출 불가 → 런타임 에러 발생
//   - 대신 localStorage API를 직접 사용

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// [수정2] localStorage에서 토큰을 읽는 순수 헬퍼 함수 (Hook 없이 동작)
const getStoredToken = (key: string): string | null => {
  const item = window.localStorage.getItem(key);

  if (!item) return null;

  try {
    return JSON.parse(item);
  } catch {
    return item;
  }
};

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지한다.
let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가한다.
axiosInstance.interceptors.request.use(
  (config) => {
    // [수정3] useLocalStorage() → getStoredToken() 으로 교체
    const accessToken = getStoredToken(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러 발생 -> refresh 토큰을 통한 토큰 갱신을 처리합니다.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // refresh 엔드포인트에서 401이 나면 → 로그아웃 처리
      if (originalRequest.url === "/v1/auth/refresh") {
        // [수정4] useLocalStorage() → removeStoredToken() 으로 교체
        window.localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        window.localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          // [수정5] useLocalStorage() → getStoredToken() 으로 교체
          const refreshToken = getStoredToken(LOCAL_STORAGE_KEY.refreshToken);

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });

          // [수정6] useLocalStorage() → setStoredToken() 으로 교체
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY.accessToken,
            JSON.stringify(data.data.accessToken),
          );
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY.refreshToken,
            JSON.stringify(data.data.refreshToken),
          );

          return data.data.accessToken;
        })()
          .catch((refreshError) => {
            // [수정7] catch 블록에서 에러를 re-throw
            //   - 기존 코드는 아무것도 반환하지 않아 Promise<undefined> → "Bearer undefined"로 재시도
            //   - 명시적으로 에러를 던져서 then 블록이 실행되지 않도록 방지
            window.localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            window.localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            return Promise.reject(refreshError);
          })
          .finally(() => {
            refreshPromise = null;
          }) as Promise<string>;
      }

      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }

    return Promise.reject(error);
  },
);
