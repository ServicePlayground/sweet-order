/**
 * 피드 HTML sanitize 유틸
 * - 최소한의 서버 방어선으로 위험 태그/속성을 제거합니다.
 */
export class FeedSanitizeUtil {
  /**
   * 인라인 이벤트 핸들러 (onclick, onload 등) 반복 제거
   * 멀티 캐릭터 매칭으로 인해 제거 후 새로운 on* 속성이 생기는 경우를 방지합니다.
   * 정규식 최적화: \s*를 [ \t\r\n]*로 구체화하여 백트래킹 감소
   */
  private static removeInlineEventHandlers(input: string): string {
    const inlineEventRegex = /[ \t\r\n]+on[a-z]+[ \t\r\n]*=[ \t\r\n]*(".*?"|'.*?'|[^\s>]+)/gi;
    let previous: string;
    let current = input;
    let iterations = 0;
    const MAX_ITERATIONS = 100; // 무한 루프 방지

    do {
      previous = current;
      current = current.replace(inlineEventRegex, "");
      iterations++;
      if (iterations >= MAX_ITERATIONS) {
        break; // 무한 루프 방지
      }
    } while (current !== previous);

    return current;
  }

  static sanitizeHtml(input: string): string {
    // ReDoS 공격 방지를 위한 입력 길이 제한
    const MAX_INPUT_LENGTH = 100000; // 100KB
    if (input.length > MAX_INPUT_LENGTH) {
      throw new Error("Input string is too long");
    }

    let sanitized = input;

    // 위험 태그 제거 - 반복 적용하여 치환 후 새로 생긴 위험 패턴도 제거
    // 열린 태그나 self-closing 태그만 제거하여 치환 후 새로운 위험 패턴이 생기는 것을 방지
    // 정규식 최적화: \s*를 [ \t\r\n]*로 구체화하여 백트래킹 감소
    let previousSanitized: string;
    let iterations = 0;
    const MAX_ITERATIONS = 100; // 무한 루프 방지
    do {
      previousSanitized = sanitized;
      sanitized = sanitized.replace(
        /<[ \t\r\n]*(script|style|iframe|object|embed|link|meta)\b[^>]*\/?[ \t\r\n]*>/gi,
        "",
      );
      iterations++;
      if (iterations >= MAX_ITERATIONS) {
        break; // 무한 루프 방지
      }
    } while (sanitized !== previousSanitized);

    // 인라인 이벤트 핸들러 제거 (onclick, onload 등)
    sanitized = this.removeInlineEventHandlers(sanitized);

    // javascript:, data:text/html 스킴 제거 - 반복 적용하여 치환 후 새로 생긴 위험 패턴도 제거
    // 정규식 최적화: \s*를 [ \t\r\n]*로 구체화하여 백트래킹 감소
    let previousHrefSrcSanitized: string;
    let hrefSrcIterations = 0;
    const MAX_HREF_SRC_ITERATIONS = 100; // 무한 루프 방지
    do {
      previousHrefSrcSanitized = sanitized;
      sanitized = sanitized.replace(
        /[ \t\r\n]+(href|src)[ \t\r\n]*=[ \t\r\n]*("|')[ \t\r\n]*(javascript:|data:text\/html)[^"']*\2/gi,
        "",
      );
      hrefSrcIterations++;
      if (hrefSrcIterations >= MAX_HREF_SRC_ITERATIONS) {
        break; // 무한 루프 방지
      }
    } while (sanitized !== previousHrefSrcSanitized);

    return sanitized.trim();
  }
}
