import { Metadata } from "next";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import RegisterForm from "@/apps/web-user/features/auth/components/forms/RegisterForm";

// 회원가입 페이지 전용 SEO 메타데이터(TODO: 추후 수정필요)
export const metadata: Metadata = {
  title: "일반 회원가입",
  description: "아이디와 비밀번호로 회원가입합니다.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "일반 회원가입",
    description: "아이디와 비밀번호로 회원가입합니다.",
    type: "website",
    url: `https://sweetorders.com${PATHS.AUTH.REGISTER_BASIC}`,
  },
};

export default function BasicRegisterPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "300px",
        gap: "40px",
      }}
    >
      <h1>일반 회원가입</h1>
      <RegisterForm />
    </div>
  );
}
