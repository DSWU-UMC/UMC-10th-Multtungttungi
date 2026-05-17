import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
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
      if (originalRequest.url === "/v1/auth/refresh") {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        window.localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = getStoredToken(LOCAL_STORAGE_KEY.refreshToken);

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY.accessToken,
            JSON.stringify(data.data.accessToken),
          );
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY.refreshToken,
            JSON.stringify(data.data.refreshToken),
          );
          // 새 accessToken을 반환하여 다른 요청들이 이것을 사용할 수 있게 함.
          return data.data.accessToken;
        })()
          .catch((refreshError) => {
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
