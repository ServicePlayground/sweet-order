/**
 * 모킹 서비스 유틸리티
 * 외부 서비스나 의존성을 모킹하는 유틸리티
 */

import { Test, TestingModule } from "@nestjs/testing";
import { GoogleService } from "@web-user/backend/modules/auth/services/google.service";
import { PhoneService } from "@web-user/backend/modules/auth/services/phone.service";

/**
 * 구글 서비스 모킹
 */
export const mockGoogleService = {
  googleLoginWithCode: jest.fn(),
  googleRegisterWithPhone: jest.fn(),
  exchangeCodeForToken: jest.fn(),
  getUserInfoFromGoogle: jest.fn(),
};

/**
 * 휴대폰 서비스 모킹
 */
export const mockPhoneService = {
  sendVerificationCode: jest.fn(),
  verifyPhoneCode: jest.fn(),
  isPhoneVerified: jest.fn(),
  sendSMS: jest.fn(),
};

/**
 * 구글 서비스 모킹 설정
 */
export const setupGoogleServiceMock = () => {
  // 성공적인 구글 로그인 모킹
  mockGoogleService.googleLoginWithCode.mockImplementation(async (codeDto) => {
    if (codeDto.code === "valid_google_code") {
      return {
        success: true,
        data: {
          userId: "googleuser123",
          googleId: "google123456789",
          googleEmail: "test@gmail.com",
          phone: "01012345678",
          accessToken: "mock_access_token",
          refreshToken: "mock_refresh_token",
        },
      };
    } else if (codeDto.code === "unverified_phone_code") {
      return {
        success: false,
        message: "휴대폰 인증이 필요합니다.",
        googleId: "google123456789",
        googleEmail: "test@gmail.com",
      };
    } else if (codeDto.code === "new_user_code") {
      return {
        success: false,
        message: "등록되지 않은 사용자입니다.",
        googleId: "google123456789",
        googleEmail: "test@gmail.com",
      };
    } else {
      throw new Error("구글 로그인 실패");
    }
  });

  // 성공적인 구글 회원가입 모킹
  mockGoogleService.googleRegisterWithPhone.mockImplementation(async (registerDto) => {
    return {
      success: true,
      data: {
        userId: "googleuser123",
        googleId: registerDto.googleId,
        googleEmail: registerDto.googleEmail,
        phone: registerDto.phone,
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
      },
    };
  });

  // 구글 토큰 교환 모킹
  mockGoogleService.exchangeCodeForToken.mockImplementation(async (code) => {
    if (code === "valid_google_code") {
      return {
        access_token: "mock_google_access_token",
        id_token: "mock_google_id_token",
      };
    } else {
      throw new Error("토큰 교환 실패");
    }
  });

  // 구글 사용자 정보 조회 모킹
  mockGoogleService.getUserInfoFromGoogle.mockImplementation(async (accessToken) => {
    return {
      id: "google123456789",
      email: "test@gmail.com",
      name: "Test User",
      picture: "https://example.com/photo.jpg",
    };
  });
};

/**
 * 휴대폰 서비스 모킹 설정
 */
export const setupPhoneServiceMock = () => {
  // 성공적인 인증번호 발송 모킹
  mockPhoneService.sendVerificationCode.mockImplementation(async (sendCodeDto) => {
    return {
      success: true,
      message: "인증번호가 발송되었습니다.",
    };
  });

  // 성공적인 인증번호 확인 모킹
  mockPhoneService.verifyPhoneCode.mockImplementation(async (verifyCodeDto) => {
    if (verifyCodeDto.verificationCode === "123456") {
      return {
        success: true,
        message: "인증이 완료되었습니다.",
      };
    } else {
      throw new Error("인증번호가 올바르지 않습니다.");
    }
  });

  // 휴대폰 인증 상태 확인 모킹
  mockPhoneService.isPhoneVerified.mockImplementation(async (phone) => {
    // 테스트용으로 특정 번호들은 인증된 상태로 설정
    const verifiedPhones = ["01012345678", "01087654321", "01011111111"];
    return verifiedPhones.includes(phone);
  });

  // SMS 발송 모킹
  mockPhoneService.sendSMS.mockImplementation(async (phone, message) => {
    return {
      success: true,
      messageId: "mock_message_id",
    };
  });
};

/**
 * 모든 모킹 서비스 초기화
 */
export const setupAllMocks = () => {
  setupGoogleServiceMock();
  setupPhoneServiceMock();
};

/**
 * 모킹 서비스 리셋
 */
export const resetAllMocks = () => {
  jest.clearAllMocks();
  setupAllMocks();
};

/**
 * 테스트 모듈에 모킹 서비스 적용
 */
export const createTestModuleWithMocks = async (moduleMetadata: any) => {
  const module: TestingModule = await Test.createTestingModule(moduleMetadata)
    .overrideProvider(GoogleService)
    .useValue(mockGoogleService)
    .overrideProvider(PhoneService)
    .useValue(mockPhoneService)
    .compile();

  return module;
};
