import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import RegisterForm from "@/apps/web-seller/features/auth/components/forms/RegisterForm";

export function BasicRegisterPage() {
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

