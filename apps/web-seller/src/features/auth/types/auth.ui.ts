import type {
  FindAccountResponseDto,
  GoogleRegisterRequestDto,
  ResetPasswordRequestDto,
} from "@/apps/web-seller/features/auth/types/auth.dto";

/** UI: 구글 회원가입 폼 */
export type GoogleRegisterForm = GoogleRegisterRequestDto;

/** UI: 계정 찾기 결과 */
export type FindAccountForm = FindAccountResponseDto;

/** UI: 비밀번호 재설정 폼 */
export type ResetPasswordForm = ResetPasswordRequestDto;
