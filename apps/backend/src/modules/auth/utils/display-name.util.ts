/**
 * 표시용 실명 마스킹 (예: 이수은 → 이*은)
 */
export function maskDisplayNameForPrivacy(name: string | null | undefined): string {
  const t = (name ?? "").trim();
  if (!t) return "";
  const chars = Array.from(t);
  if (chars.length <= 1) return "*";
  if (chars.length === 2) return `${chars[0]}*`;
  if (chars.length === 3) return `${chars[0]}*${chars[2]}`;
  return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}
