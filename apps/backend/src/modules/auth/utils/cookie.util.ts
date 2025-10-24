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
    const isDevelopment = this.configService.get("NODE_ENV") === "development";

    res.cookie(name, value, {
      domain: isDevelopment ? undefined : COOKIE_CONFIG.DOMAIN, // 개발환경에서는 DOMAIN 설정 안함
      httpOnly: COOKIE_CONFIG.HTTP_ONLY,
      secure: !isDevelopment, // 개발환경에서는 SECURE 쿠키 설정 안함
      sameSite: COOKIE_CONFIG.SAME_SITE,
      maxAge: maxAge * 1000, // 쿠키 만료 시간 (초를 밀리초로 변환)
    });
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
    res.clearCookie(name);
  }
}
