/**
 * 인증 관련 타입 정의
 *
 * 사용자 인증과 관련된 모든 타입들을 중앙 집중식으로 관리합니다.
 */

/**
 * 사용자 정보 인터페이스
 *
 * ERD User 테이블의 주요 필드를 포함하는 사용자 정보 구조를 정의합니다.
 */
export interface UserInfo {
  /** 사용자 ID (ERD User.id) */
  id: string;
  /** 사용자 식별자 (ERD User.userId) */
  userId: string;
  /** 사용자 이름 (ERD User.name) */
  name?: string;
  /** 휴대폰 번호 (ERD User.phone) */
  phone?: string;
  /** 닉네임 (ERD User.nickname) */
  nickname?: string;
  /** 프로필 이미지 URL (ERD User.profile_image_url) */
  profileImageUrl?: string;
  /** 인증 상태 (ERD User.is_verified) */
  isVerified: boolean;
}

/**
 * 인증 응답 인터페이스
 *
 * 로그인, 회원가입 등 인증 성공 시 반환되는 응답 구조를 정의합니다.
 */
export interface AuthResponse {
  /** 액세스 토큰 */
  accessToken: string;
  /** 리프레시 토큰 */
  refreshToken: string;
  /** 토큰 만료 시간 (초) */
  expiresIn: number;
  /** 사용자 정보 */
  user: UserInfo;
}
