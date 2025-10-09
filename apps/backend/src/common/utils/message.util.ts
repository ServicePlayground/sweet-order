/**
 * 통일된 메시지 객체를 생성하는 유틸 함수
 * @param message - 메시지 문자열
 * @returns { message: string } 형태의 객체
 */
export const createMessageObject = (message: string) => {
  return {
    message,
  };
};
