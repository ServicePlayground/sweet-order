import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { COOKIE_CONFIG } from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 쿠키 기반 토큰 관리 서비스
 * 서브도메인 통합 로그인을 위한 쿠키 설정을 제공합니다.
 */
@Injectable()
export class CookieUtil {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 공통 쿠키 옵션을 생성합니다.
   * @param maxAge 쿠키 만료 시간 (초) - 설정 시에만 사용, 삭제 시에는 undefined
   * @returns 쿠키 옵션 객체
   */
  private getCookieOptions(maxAge?: number) {
    const isDevelopment = this.configService.get("NODE_ENV") === "development";

    return {
      domain: isDevelopment ? undefined : COOKIE_CONFIG.DOMAIN,
      httpOnly: COOKIE_CONFIG.HTTP_ONLY,
      secure: !isDevelopment,
      sameSite: COOKIE_CONFIG.SAME_SITE,
      path: "/",
      ...(maxAge && { maxAge: maxAge * 1000 }), // 설정 시에만 maxAge 포함
    };
  }
  /**
   * 액세스 토큰을 쿠키에 설정합니다.
   * @param res Express Response 객체
   * @param accessToken 액세스 토큰
   * @param maxAge 쿠키 만료 시간 (초)
   */
  setAccessTokenCookie(res: Response, accessToken: string, maxAge: number) {
    this.setCookie(res, COOKIE_CONFIG.ACCESS_TOKEN_NAME, accessToken, maxAge);
  }

  /**
   * 리프레시 토큰을 쿠키에 설정합니다.
   * @param res Express Response 객체
   * @param refreshToken 리프레시 토큰
   * @param maxAge 쿠키 만료 시간 (초)
   */
  setRefreshTokenCookie(res: Response, refreshToken: string, maxAge: number) {
    this.setCookie(res, COOKIE_CONFIG.REFRESH_TOKEN_NAME, refreshToken, maxAge);
  }

  /**
   * 공통 쿠키 설정 메서드
   * @param res Express Response 객체
   * @param name 쿠키 이름
   * @param value 쿠키 값
   * @param maxAge 쿠키 만료 시간 (초)
   */
  private setCookie(res: Response, name: string, value: string, maxAge: number) {
    res.cookie(name, value, this.getCookieOptions(maxAge));
  }

  /**
   * 모든 인증 쿠키를 삭제합니다.
   * @param res Express Response 객체
   */
  clearAllAuthCookies(res: Response) {
    this.clearAccessTokenCookie(res);
    this.clearRefreshTokenCookie(res);
  }

  /**
   * 액세스 토큰 쿠키를 삭제합니다.
   * @param res Express Response 객체
   */
  clearAccessTokenCookie(res: Response) {
    this.clearCookie(res, COOKIE_CONFIG.ACCESS_TOKEN_NAME);
  }

  /**
   * 리프레시 토큰 쿠키를 삭제합니다.
   * @param res Express Response 객체
   */
  clearRefreshTokenCookie(res: Response) {
    this.clearCookie(res, COOKIE_CONFIG.REFRESH_TOKEN_NAME);
  }

  /**
   * 공통 쿠키 삭제 메서드
   * @param res Express Response 객체
   * @param name 쿠키 이름
   */
  private clearCookie(res: Response, name: string) {
    // setCookie 메서드에서 쿠키가 설정된 옵션과 동일하게 설정해야함
    res.clearCookie(name, this.getCookieOptions());
  }
}
