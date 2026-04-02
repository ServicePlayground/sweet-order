/** HTML 피드 본문에서 홈 목록용 짧은 텍스트만 추출 */
export function feedContentToExcerpt(html: string, maxLength = 120): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
