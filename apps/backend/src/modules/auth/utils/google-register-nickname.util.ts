import { randomInt } from "node:crypto";

/**
 * 구글 회원가입 시 초기 닉네임: `{실명}_{3 또는 4자리 난수}`
 * 전화번호 전체를 붙이면 10·11자리 등 길이 편차가 커서, 짧은 난수 접미사로 구분합니다.
 */
export function buildInitialNicknameFromName(displayName: string): string {
  const base = displayName.trim();
  const useFourDigits = randomInt(2) === 1;
  const suffix = useFourDigits ? String(randomInt(1000, 10000)) : String(randomInt(100, 1000));
  return `${base}_${suffix}`;
}
