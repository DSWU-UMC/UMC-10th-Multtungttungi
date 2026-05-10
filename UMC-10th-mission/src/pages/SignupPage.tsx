import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다. " }),
    password: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),

    passwordCheck: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const isFirstStepValid =
    !errors.name &&
    !errors.email &&
    watch("name").trim().length > 0 &&
    watch("email").trim().length > 0;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;

    const response = await postSignup(rest);

    if (response) {
      console.log(response);
      alert("회원가입이 완료되었습니다.");
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("문제가 발생했습니다:", errors),
      )}
      className="flex flex-col gap-3 w-[300px]"
    >
      <input
        {...register("name")}
        className={`border w-full p-[10px] rounded-lg bg-[#1a1a1a] text-sm focus:outline-none
        ${errors?.name ? "border-red-500" : "border-gray-800"}`}
        type={"name"}
        placeholder={"이름을 입력해  주세요!"}
      />
      {errors.name && (
        <div className={"text-red-500 text-sm"}>{errors.name.message}</div>
      )}

      <input
        {...register("email")}
        className={`border w-full p-[10px] rounded-lg bg-[#1a1a1a] text-sm focus:outline-none
        ${errors?.email ? "border-red-500" : "border-gray-800"}`}
        type={"email"}
        placeholder={"이메일을 입력해 주세요!"}
      />
      {errors.email && (
        <div className={"text-red-500 text-sm"}>{errors.email.message}</div>
      )}

      {isFirstStepValid && (
        <>
          <div className="relative w-full">
            <input
              {...register("password")}
              className={`border w-full p-[10px] rounded-lg bg-[#1a1a1a] text-sm focus:outline-none
        ${errors?.password ? "border-red-500" : "border-gray-800"}`}
              type={showPassword ? "text" : "password"}
              placeholder={"비밀번호를 입력해 주세요!"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[10px] text-gray-500 text-lg cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {errors.password && (
            <div className={"text-red-500 text-sm"}>
              {errors.password.message}
            </div>
          )}

          <div className="relative w-full">
            <input
              {...register("passwordCheck")}
              className={`border w-full p-[10px] rounded-lg bg-[#1a1a1a] text-sm focus:outline-none
        ${errors?.passwordCheck ? "border-red-500" : "border-gray-800"}`}
              type={showPasswordCheck ? "text" : "password"}
              placeholder={"비밀번호 확인"}
            />
            <button
              type="button"
              onClick={() => setShowPasswordCheck(!showPasswordCheck)}
              className="absolute right-3 top-[10px] text-gray-500 text-lg cursor-pointer"
            >
              {showPasswordCheck ? "🙈" : "👁️"}
            </button>
          </div>

          {errors.passwordCheck && (
            <div className={"text-red-500 text-sm"}>
              {errors.passwordCheck.message}
            </div>
          )}
        </>
      )}

      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full p-3 rounded-lg mt-2 cursor-pointer text-sm font-bold disabled:bg-gray-700 disabled:text-gray-500 enabled:bg-[#ff007f] enabled:text-white hover:enabled:bg-[#e60073]"
      >
        회원가입
      </button>
    </form>
  );
};

export default SignupPage;
