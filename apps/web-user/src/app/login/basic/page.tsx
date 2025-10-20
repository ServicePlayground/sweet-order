import { Metadata } from "next";
import Link from "next/link";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import LoginForm from "@/apps/web-user/features/auth/components/forms/LoginForm";

// 로그인 페이지 전용 SEO 메타데이터(TODO: 추후 수정필요)
export const metadata: Metadata = {
  title: "일반 로그인",
  description: "아이디와 비밀번호로 로그인합니다.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "일반 로그인",
    description: "아이디와 비밀번호로 로그인합니다.",
    type: "website",
    url: `https://sweetorders.com${PATHS.AUTH.LOGIN_BASIC}`,
  },
};

export default function BasicLoginPage() {
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
      <h1>일반 로그인</h1>
      <LoginForm />
      <div style={{ border: "1px solid black", width: "500px", height: "1px" }} />
      <Link href={PATHS.AUTH.REGISTER_BASIC}>회원가입</Link>
    </div>
  );
}
