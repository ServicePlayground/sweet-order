"use client";

import { useState } from "react";
import Link from "next/link";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { useFindAccount } from "@/apps/web-user/features/auth/hooks/queries/useAuth";
import PhoneVerificationForm from "@/apps/web-user/features/auth/components/forms/PhoneVerificationForm";
import FindAccountResultForm from "@/apps/web-user/features/auth/components/forms/FindAccountResultForm";
import {
  FindAccountFormData,
  PHONE_VERIFICATION_PURPOSE,
} from "@/apps/web-user/features/auth/types/auth.type";

export default function FindAccountPage() {
  const findAccountMutation = useFindAccount();
  const [accountInfo, setAccountInfo] = useState<FindAccountFormData | null>(null);
  const [currentStep, setCurrentStep] = useState<"phoneVerification" | "result">(
    "phoneVerification",
  );

  // 휴대폰 인증 완료 후 계정 찾기 처리
  const handlePhoneVerificationComplete = async (phone: string) => {
    const result = await findAccountMutation.mutateAsync(phone);
    setAccountInfo(result);
    setCurrentStep("result");
  };

  // 결과 표시 단계
  if (currentStep === "result" && accountInfo) {
    return <FindAccountResultForm accountInfo={accountInfo} />;
  }

  // 휴대폰 인증 단계
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
          계정 찾기
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
            marginBottom: "32px",
            lineHeight: "1.5",
          }}
        >
          휴대폰 번호로 등록된 계정을 찾아드립니다.
        </p>

        <PhoneVerificationForm
          onVerificationComplete={handlePhoneVerificationComplete}
          purpose={PHONE_VERIFICATION_PURPOSE.ID_FIND}
        />

        <Link
          href={PATHS.AUTH.LOGIN}
          style={{
            color: "#666",
            fontSize: "14px",
            textDecoration: "none",
            marginTop: "24px",
            textAlign: "center",
            display: "block",
          }}
        >
          ← 로그인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
