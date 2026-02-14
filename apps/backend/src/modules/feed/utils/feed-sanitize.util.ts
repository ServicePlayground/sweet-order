/**
 * 피드 HTML sanitize 유틸
 * - 최소한의 서버 방어선으로 위험 태그/속성을 제거합니다.
 */
export class FeedSanitizeUtil {
  /**
   * 인라인 이벤트 핸들러 (onclick, onload 등) 반복 제거
   * 멀티 캐릭터 매칭으로 인해 제거 후 새로운 on* 속성이 생기는 경우를 방지합니다.
   */
  private static removeInlineEventHandlers(input: string): string {
    const inlineEventRegex = /\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
    let previous: string;
    let current = input;

    do {
      previous = current;
      current = current.replace(inlineEventRegex, "");
    } while (current !== previous);

    return current;
  }

  static sanitizeHtml(input: string): string {
    let sanitized = input;

    // 위험 태그 제거 - 반복 적용하여 치환 후 새로 생긴 위험 패턴도 제거
    // 열린 태그나 self-closing 태그만 제거하여 치환 후 새로운 위험 패턴이 생기는 것을 방지
    let previousSanitized: string;
    do {
      previousSanitized = sanitized;
      sanitized = sanitized.replace(
        /<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*\/?\s*>/gi,
        "",
      );
    } while (sanitized !== previousSanitized);

    // 인라인 이벤트 핸들러 제거 (onclick, onload 등)
    sanitized = this.removeInlineEventHandlers(sanitized);

    // javascript:, data:text/html 스킴 제거 - 반복 적용하여 치환 후 새로 생긴 위험 패턴도 제거
    let previousHrefSrcSanitized: string;
    do {
      previousHrefSrcSanitized = sanitized;
      sanitized = sanitized.replace(
        /\s(href|src)\s*=\s*("|')\s*(javascript:|data:text\/html)[^"']*\2/gi,
        "",
      );
    } while (sanitized !== previousHrefSrcSanitized);

    return sanitized.trim();
  }
}
