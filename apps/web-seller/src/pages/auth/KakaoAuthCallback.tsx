import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/apps/web-seller/features/auth/apis/auth.api";
import { useKakaoRegister } from "@/apps/web-seller/features/auth/hooks/mutations/useAuthMutation";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import PhoneVerificationForm from "@/apps/web-seller/features/auth/components/forms/PhoneVerificationForm";
import { Input } from "@/apps/web-seller/common/components/inputs/Input";
import { PHONE_VERIFICATION_PURPOSE } from "@/apps/web-seller/features/auth/types/auth.dto";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-seller/features/auth/constants/auth.constant";

export function KakaoAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const kakaoRegisterMutation = useKakaoRegister();
  const { addAlert } = useAlertStore();

  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [kakaoLoginData, setKakaoLoginData] = useState<{
    kakaoId: string;
    kakaoEmail: string;
  } | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      navigate(ROUTES.ROOT);
      return;
    }

    const run = async () => {
      try {
        const data = await authApi.kakaoLogin(code);
        login({ navigate, accessToken: data.accessToken });
      } catch (error: unknown) {
        const err = error as {
          response?: {
            data?: {
              message?: string;
              data?: { kakaoId?: string; kakaoEmail?: string; message?: string };
            };
          };
        };
        const payload = (err?.response?.data?.data ?? err?.response?.data ?? {}) as {
          message?: string;
          kakaoId?: string;
          kakaoEmail?: string;
        };
        const message = payload.message ?? "";
        const kakaoId = payload.kakaoId;
        const kakaoEmail = payload.kakaoEmail;

        if (
          typeof message === "string" &&
          message.includes(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED) &&
          kakaoId &&
          kakaoEmail
        ) {
          setKakaoLoginData({ kakaoId, kakaoEmail });
          setShowPhoneVerification(true);
        } else {
          navigate(ROUTES.AUTH.LOGIN);
          addAlert({
            message: getApiMessage.error(error),
            title: "오류",
            severity: "error",
          });
        }
      }
    };

    void run();
  }, [searchParams, navigate, login, addAlert]);

  const validateDisplayName = (value: string) => {
    const t = value.trim();
    if (!t) {
      setNameError(AUTH_ERROR_MESSAGES.NAME_REQUIRED);
      return false;
    }
    if (t.length > 50) {
      setNameError(AUTH_ERROR_MESSAGES.NAME_MAX_LENGTH);
      return false;
    }
    setNameError("");
    return true;
  };

  const handleDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayName(value);
    if (value.trim()) validateDisplayName(value);
    else setNameError("");
  };

  const handlePhoneVerificationComplete = async (phone: string) => {
    if (!kakaoLoginData) return;
    if (!validateDisplayName(displayName)) return;

    await kakaoRegisterMutation.mutateAsync({
      ...kakaoLoginData,
      phone,
      name: displayName.trim(),
    });
  };

  if (showPhoneVerification) {
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
          <h2
            style={{
              margin: "0 0 24px",
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              lineHeight: 1.35,
              letterSpacing: "-0.02em",
              color: "#18181b",
            }}
          >
            회원가입
          </h2>
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="kakao-auth-display-name"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#3f3f46",
              }}
            >
              이름
            </label>
            <Input
              id="kakao-auth-display-name"
              type="text"
              name="displayName"
              value={displayName}
              onChange={handleDisplayNameChange}
              error={nameError}
              placeholder="실명을 입력해 주세요"
              maxLength={50}
              autoComplete="name"
              aria-invalid={!!nameError}
            />
          </div>
          <PhoneVerificationForm
            onVerificationComplete={handlePhoneVerificationComplete}
            purpose={PHONE_VERIFICATION_PURPOSE.KAKAO_REGISTRATION}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div>카카오 로그인 처리 중...</div>
    </div>
  );
}
