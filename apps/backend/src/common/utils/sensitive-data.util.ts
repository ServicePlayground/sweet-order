/**
 * 민감 정보 마스킹 유틸리티
 * 로깅 시 민감 정보를 안전하게 마스킹 처리합니다.
 */
export class SensitiveDataUtil {
  /**
   * 이메일 주소 마스킹
   * @param email 이메일 주소
   * @returns 마스킹된 이메일 (예: us****@example.com)
   */
  static maskEmail(email: string): string {
    if (!email || !email.includes("@")) {
      return email;
    }

    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }

    const visibleChars = Math.min(2, Math.floor(localPart.length / 2));
    const masked = localPart.slice(0, visibleChars) + "***" + localPart.slice(-visibleChars);
    return `${masked}@${domain}`;
  }

  /**
   * 비밀번호 마스킹 (전체 마스킹)
   * @param password 비밀번호
   * @returns 마스킹된 비밀번호 (****)
   */
  static maskPassword(password: string): string {
    if (!password) {
      return "";
    }
    return "****";
  }

  /**
   * API 키/토큰 마스킹
   * @param token 토큰 또는 API 키
   * @returns 마스킹된 토큰 (앞 4자리 + ****)
   */
  static maskToken(token: string): string {
    if (!token || token.length <= 4) {
      return "****";
    }
    return token.slice(0, 4) + "****";
  }

  /**
   * 환경 변수 값 마스킹
   * @param value 환경 변수 값
   * @returns 마스킹된 값
   */
  static maskEnvValue(value: string): string {
    if (!value) {
      return "";
    }
    if (value.length <= 8) {
      return "****";
    }
    return value.slice(0, 4) + "****" + value.slice(-4);
  }

  /**
   * 객체에서 민감 정보를 마스킹 처리
   * @param obj 객체
   * @returns 민감 정보가 마스킹된 객체
   */
  static maskSensitiveFields(obj: any): any {
    if (!obj || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.maskSensitiveFields(item));
    }

    const masked: any = {};
    const sensitiveKeys = [
      "password",
      "passwordHash",
      "token",
      "accessToken",
      "refreshToken",
      "apiKey",
      "secret",
      "authorization",
      "cookie",
      "email",
      "phone",
      "phoneNumber",
      "businessNo",
      "businessNumber",
      "creditCard",
      "ssn",
      "socialSecurityNumber",
    ];

    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((sensitiveKey) => lowerKey.includes(sensitiveKey))) {
        if (typeof value === "string") {
          if (lowerKey.includes("password") || lowerKey.includes("hash")) {
            masked[key] = this.maskPassword(value);
          } else if (
            lowerKey.includes("token") ||
            lowerKey.includes("apikey") ||
            lowerKey.includes("secret")
          ) {
            masked[key] = this.maskToken(value);
          } else if (lowerKey.includes("email")) {
            masked[key] = this.maskEmail(value);
          } else if (lowerKey.includes("phone")) {
            // PhoneUtil.maskPhone 사용 (이미 구현되어 있음)
            masked[key] =
              value.length > 7 ? value.slice(0, 3) + "-****-" + value.slice(-4) : "****";
          } else {
            masked[key] = this.maskEnvValue(value);
          }
        } else {
          masked[key] = value;
        }
      } else if (typeof value === "object" && value !== null) {
        masked[key] = this.maskSensitiveFields(value);
      } else {
        masked[key] = value;
      }
    }

    return masked;
  }

  /**
   * 에러 객체에서 민감 정보 제거
   * @param error 에러 객체
   * @returns 민감 정보가 제거된 에러 객체
   */
  static sanitizeError(error: any): any {
    if (!error) {
      return error;
    }

    const sanitized: any = {
      message: error.message || String(error),
      name: error.name,
      stack: error.stack,
    };

    // 스택 트레이스에서 민감 정보 제거 (환경 변수, 토큰 등)
    if (sanitized.stack) {
      sanitized.stack = sanitized.stack
        .split("\n")
        .map((line: string) => {
          // 환경 변수 패턴 제거
          line = line.replace(/[A-Z_]+=\S+/g, "***=****");
          // 토큰 패턴 제거
          line = line.replace(/Bearer\s+\S+/g, "Bearer ****");
          line = line.replace(/token[=:]\S+/gi, "token=****");
          return line;
        })
        .join("\n");
    }

    // 에러 객체의 다른 속성들도 마스킹
    if (error.response) {
      sanitized.response = this.maskSensitiveFields(error.response);
    }

    if (error.config) {
      sanitized.config = this.maskSensitiveFields(error.config);
    }

    return sanitized;
  }
}
