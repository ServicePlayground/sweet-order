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
}
