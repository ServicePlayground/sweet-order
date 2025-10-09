import { randomInt } from "crypto";

export class PhoneUtil {
  /**
   * 휴대폰 번호를 정규화합니다.
   */
  static normalizePhone(phone: string): string {
    // 하이픈, 공백, 괄호 제거
    return phone.replace(/[\s\-()]/g, "");
  }

  /**
   * 6자리 인증번호를 생성합니다.
   * @returns 6자리 인증번호
   */
  static generateVerificationCode(): string {
    return randomInt(100000, 999999).toString();
  }

  /**
   * 인증번호 만료 시간을 계산합니다.
   * @param minutes 만료 시간 (분)
   * @returns 만료 시간 Date 객체
   */
  static getExpirationTime(minutes: number = 5): Date {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60 * 1000);
  }

  /**
   * 휴대폰 번호를 마스킹 처리합니다.
   * @param phone 휴대폰 번호
   * @returns 마스킹된 휴대폰 번호
   */
  static maskPhone(phone: string): string {
    const normalizedPhone = this.normalizePhone(phone);

    if (normalizedPhone.length === 11) {
      // 010-1234-5678 -> 010-****-5678
      return `${normalizedPhone.slice(0, 3)}-****-${normalizedPhone.slice(7)}`;
    } else if (normalizedPhone.length === 10) {
      // 010-123-4567 -> 010-***-4567
      return `${normalizedPhone.slice(0, 3)}-***-${normalizedPhone.slice(6)}`;
    }

    return phone;
  }

  /**
   * 휴대폰 번호를 표시용 형식으로 변환합니다.
   * @param phone 휴대폰 번호
   * @returns 표시용 휴대폰 번호
   */
  static formatPhoneForDisplay(phone: string): string {
    const normalizedPhone = this.normalizePhone(phone);

    if (normalizedPhone.length === 11) {
      // 01012345678 -> 010-1234-5678
      return `${normalizedPhone.slice(0, 3)}-${normalizedPhone.slice(3, 7)}-${normalizedPhone.slice(7)}`;
    } else if (normalizedPhone.length === 10) {
      // 0101234567 -> 010-123-4567
      return `${normalizedPhone.slice(0, 3)}-${normalizedPhone.slice(3, 6)}-${normalizedPhone.slice(6)}`;
    }

    return phone;
  }
}
