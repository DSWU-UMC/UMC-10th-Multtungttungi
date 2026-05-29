import { useLocation, useNavigate } from "react-router-dom"; // 추가된 부분
import useForm from "../hooks/useForm";
import { validateSignin, type UserSignInformation } from "../utils/validate";
import googleLogo from "../assets/google.jpg";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const from = location.state?.from || "/";
  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [navigate, accessToken, from]);

  const { values, errors, touched, getInputProps } =
    useForm<UserSignInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    await login(values);
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };
  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error: string) => error.length > 0) || // 오류가 있으면 true
    Object.values(values).some((value) => value === ""); // 입력값이 비어있으면 true

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 w-[300px]">
      {/* 상단 뒤로가기 & 타이틀 영역 */}
      <div className="relative w-full flex items-center justify-center py-2">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 text-gray-400 hover:text-white"
        >
          &lt;
        </button>
        <h2 className="text-lg font-medium text-white">로그인</h2>
      </div>

      {/* 구글 로그인 버튼 */}
      <button
        className="flex items-center justify-center w-full bg-[#ffffff] text-[#191919] rounded-lg py-3 text-sm font-bold hover:bg-[#f0f0f0] cursor-pointer"
        onClick={handleGoogleLogin}
      >
        <img src={googleLogo} alt="Google Logo" className="w-5 h-5 mr-2" />
        구글 로그인
      </button>

      {/* 구분선 */}
      <div className="flex items-center w-full gap-4 text-xs text-gray-600">
        <hr className="flex-1 border-gray-800" />
        OR
        <hr className="flex-1 border-gray-800" />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <input
          {...getInputProps("email")}
          name="email"
          className={`border w-full p-[10px] rounded-lg bg-[#1a1a1a] text-sm focus:outline-none
            ${errors?.email && touched?.email ? "border-red-500" : "border-gray-800"}`}
          type={"email"}
          placeholder={"이메일을 입력해주세요!"}
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-xs px-1">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          name="password"
          className={`border w-full p-[10px] rounded-lg bg-[#1a1a1a] text-sm focus:outline-none
            ${errors?.password && touched?.password ? "border-red-500" : "border-gray-800"}`}
          type={"password"}
          placeholder={"비밀번호를 입력해주세요!"}
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-xs px-1">{errors.password}</div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full p-3 rounded-lg mt-2 cursor-pointer text-sm font-bold disabled:bg-gray-700 disabled:text-gray-500 enabled:bg-[#ff007f] enabled:text-white hover:enabled:bg-[#e60073]"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
