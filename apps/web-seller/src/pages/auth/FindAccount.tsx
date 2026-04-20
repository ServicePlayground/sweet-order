import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, RefreshCw } from "lucide-react";
import PhoneVerificationForm from "@/apps/web-seller/features/auth/components/forms/PhoneVerificationForm";
import { useFindAccount } from "@/apps/web-seller/features/auth/hooks/mutations/useAuthMutation";
import {
  PHONE_VERIFICATION_PURPOSE,
  type FindAccountResponseDto,
} from "@/apps/web-seller/features/auth/types/auth.dto";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { AuthCardLayout } from "@/apps/web-seller/common/components/layouts/AuthCardLayout";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

/**
 * 판매자 계정 찾기 — 휴대폰 인증(`FIND_ACCOUNT`) 후 `POST /v1/seller/auth/find-account`
 */
export function FindAccountPage() {
  const findAccountMutation = useFindAccount();
  const [result, setResult] = useState<FindAccountResponseDto | null>(null);

  const handleVerificationComplete = async (phone: string) => {
    try {
      const data = await findAccountMutation.mutateAsync({ phone });
      setResult(data);
    } catch {
      // 오류는 useFindAccount에서 알림 처리
    }
  };

  return (
    <AuthCardLayout>
      <div className="flex flex-col gap-8">
        <div className="space-y-3 text-center">
          <h1 className="text-[1.65rem] font-bold tracking-tight text-zinc-900 sm:text-[1.75rem]">
            계정 찾기
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500">
            가입 시 사용한 휴대폰 번호로 인증하면, 연결된 소셜 계정 정보를 확인할 수 있습니다.
          </p>
        </div>

        {result ? (
          <div
            className={cn(
              "rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-5",
              result.loginEmail && "border-emerald-200/80 bg-emerald-50/50",
            )}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  result.loginEmail
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-200/80 text-zinc-600",
                )}
              >
                <Mail className="h-4 w-4" strokeWidth={2} aria-hidden />
              </div>
              <p className="text-sm font-semibold text-zinc-900">조회 결과</p>
            </div>
            {result.loginEmail ? (
              <p className="break-all text-[15px] leading-relaxed text-zinc-800">
                <span className="text-zinc-500">
                  연결된 {result.loginType === "kakao" ? "카카오" : "구글"} 계정
                </span>
                <br />
                <span className="text-base font-semibold text-zinc-900">{result.loginEmail}</span>
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-zinc-600">
                해당 번호로 등록된 계정은 있으나, 이메일 정보가 연동되어 있지 않습니다.
              </p>
            )}
            <button
              type="button"
              onClick={() => setResult(null)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              다시 조회하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <PhoneVerificationForm
              onVerificationComplete={handleVerificationComplete}
              purpose={PHONE_VERIFICATION_PURPOSE.FIND_ACCOUNT}
            />
            {findAccountMutation.isPending ? (
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
                계정 정보를 조회하는 중...
              </div>
            ) : null}
          </div>
        )}

        <div className="flex justify-center border-t border-zinc-100 pt-1">
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </AuthCardLayout>
  );
}
