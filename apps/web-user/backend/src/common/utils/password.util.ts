import * as bcrypt from "bcrypt";

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 12; // 12라운드로 해시화

  /**
   * 비밀번호를 해시화합니다.
   * @param password 원본 비밀번호
   * @returns 해시화된 비밀번호
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * 비밀번호를 검증합니다.
   * @param password 원본 비밀번호
   * @param hashedPassword 해시화된 비밀번호
   * @returns 비밀번호 일치 여부
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * 비밀번호 정책을 검증합니다.
   * @param password 검증할 비밀번호
   * @param policy 비밀번호 정책
   * @returns 검증 결과
   */
  static validatePasswordPolicy(
    password: string,
    policy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    },
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < policy.minLength) {
      errors.push(`비밀번호는 최소 ${policy.minLength}자 이상이어야 합니다.`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("비밀번호는 대문자를 포함해야 합니다.");
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push("비밀번호는 소문자를 포함해야 합니다.");
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push("비밀번호는 숫자를 포함해야 합니다.");
    }

    if (policy.requireSpecialChars && !/[@$!%*?&]/.test(password)) {
      errors.push("비밀번호는 특수문자(@$!%*?&)를 포함해야 합니다.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
