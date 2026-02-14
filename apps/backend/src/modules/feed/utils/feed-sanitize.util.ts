/**
 * 피드 HTML sanitize 유틸
 * - 최소한의 서버 방어선으로 위험 태그/속성을 제거합니다.
 */
export class FeedSanitizeUtil {
  static sanitizeHtml(input: string): string {
    let sanitized = input;

    // 위험 태그 제거
    sanitized = sanitized.replace(
      /<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
      "",
    );
    sanitized = sanitized.replace(
      /<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*\/?\s*>/gi,
      "",
    );

    // 인라인 이벤트 핸들러 제거 (onclick, onload 등)
    sanitized = sanitized.replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");

    // javascript:, data:text/html 스킴 제거
    sanitized = sanitized.replace(
      /\s(href|src)\s*=\s*("|')\s*(javascript:|data:text\/html)[^"']*\2/gi,
      "",
    );

    return sanitized.trim();
  }
}
