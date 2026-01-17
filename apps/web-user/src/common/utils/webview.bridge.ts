/**
 * 웹뷰(Flutter)와 통신하는 브릿지 유틸리티
 * 모든 웹뷰 통신 관련 코드는 이 파일에 위치합니다.
 */

// Flutter 웹뷰에서 제공하는 Loginpage 인터페이스 타입 정의
interface LoginpageInterface {
  postMessage: (message: string) => void;
}

// window 객체에 Loginpage 속성 추가
declare global {
  interface Window {
    Loginpage?: LoginpageInterface;
  }
}

/**
 * 로그인 페이지로 이동하는 웹뷰 통신 함수
 * Flutter 앱의 로그인 페이지로 이동하도록 메시지를 전송합니다.
 */
export function navigateToLoginPage(): void {
  if (typeof window === "undefined") {
    console.warn("웹뷰 브릿지는 브라우저 환경에서만 동작합니다.");
    return;
  }

  if (!window.Loginpage) {
    console.warn("Loginpage 브릿지가 초기화되지 않았습니다. Flutter 웹뷰 환경인지 확인해주세요.");
    return;
  }

  try {
    window.Loginpage.postMessage("true");
  } catch (error) {
    console.error("로그인 페이지 이동 중 오류가 발생했습니다:", error);
  }
}

/**
 * 웹뷰 환경인지 확인하는 함수
 */
export function isWebViewEnvironment(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return typeof window.Loginpage !== "undefined";
}

