import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/apps/web-seller/features/auth/apis/auth.api";
import { useGoogleRegister } from "@/apps/web-seller/features/auth/hooks/mutations/useAuthMutation";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import PhoneVerificationForm from "@/apps/web-seller/features/auth/components/forms/PhoneVerificationForm";
import { Input } from "@/apps/web-seller/common/components/inputs/Input";
import { PHONE_VERIFICATION_PURPOSE } from "@/apps/web-seller/features/auth/types/auth.dto";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-seller/features/auth/constants/auth.constant";

/**
 * 구글 OAuth 리다이렉트 콜백 — `code`로 `/v1/seller/auth/google/login` 호출
 * 휴대폰 미연동 시 백엔드가 `googleId`/`googleEmail`과 함께 400 → 이 화면에서 휴대폰 인증 후 register
 */
export function GoogleAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const googleRegisterMutation = useGoogleRegister();
  const { addAlert } = useAlertStore();

  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [googleLoginData, setGoogleLoginData] = useState<{
    googleId: string;
    googleEmail: string;
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
        const data = await authApi.googleLogin(code);
        login({ navigate, accessToken: data.accessToken });
      } catch (error: unknown) {
        const err = error as {
          response?: {
            data?: { data?: { googleId?: string; googleEmail?: string; message?: string } };
          };
        };
        const { googleId, googleEmail, message } = err?.response?.data?.data || {};

        if (
          message === AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED &&
          googleId &&
          googleEmail
        ) {
          setGoogleLoginData({ googleId, googleEmail });
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
    if (!googleLoginData) return;
    if (!validateDisplayName(displayName)) return;

    await googleRegisterMutation.mutateAsync({
      ...googleLoginData,
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
              htmlFor="google-auth-display-name"
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
              id="google-auth-display-name"
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
            purpose={PHONE_VERIFICATION_PURPOSE.GOOGLE_REGISTRATION}
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
      <div>구글 로그인 처리 중...</div>
    </div>
  );
}
