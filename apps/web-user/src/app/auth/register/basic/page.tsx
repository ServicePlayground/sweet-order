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
        minHeight: "100vh",
        padding: "40px 20px",
        backgroundColor: "#fafafa",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ textAlign: "center", marginBottom: "32px", fontSize: "24px", fontWeight: "600" }}
        >
          일반 회원가입
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
}
