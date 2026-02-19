/**
 * 스토어 이름 유효성 검증 및 에러 메시지 반환
 */
export const validateStoreName = (name: string): string | null => {
  // 미입력 검증
  if (!name || !name.trim()) {
    return "스토어 이름을 입력해주세요.";
  }

  const trimmedName = name.trim();

  // 2자 미만 검증
  if (trimmedName.length < 2) {
    return "스토어 이름을 2자 이상 입력해주세요.";
  }

  // 30자 초과 검증
  if (trimmedName.length > 30) {
    return "스토어 이름은 30자 이하여야 합니다.";
  }

  // 특수문자 제한 검증 (한글, 영문, 숫자, 공백만 허용)
  const storeNamePattern = /^[가-힣a-zA-Z0-9\s]+$/;
  if (!storeNamePattern.test(trimmedName)) {
    return "스토어 이름은 한글, 영문, 숫자만 사용할 수 있습니다.";
  }

  return null;
};

/**
 * 스토어 설명 유효성 검증 및 에러 메시지 반환
 */
export const validateStoreDescription = (description: string | undefined): string | null => {
  // 선택 필드이므로 값이 없으면 통과
  if (!description) {
    return null;
  }

  // 500자 초과 검증
  if (description.length > 500) {
    return "스토어 설명은 500자 이하로 입력해주세요.";
  }

  // HTML 태그 검증 (< > 태그가 포함되어 있는지 확인)
  const htmlTagPattern = /<[^>]*>/;
  if (htmlTagPattern.test(description)) {
    return "스토어 설명에는 HTML 태그를 사용할 수 없습니다.";
  }

  return null;
};

/**
 * 상세주소 유효성 검증 및 에러 메시지 반환
 */
export const validateDetailAddress = (detailAddress: string): string | null => {
  // 미입력 검증
  if (!detailAddress || !detailAddress.trim()) {
    return "상세주소를 입력해주세요.";
  }

  const trimmedAddress = detailAddress.trim();

  // 2자 미만 검증
  if (trimmedAddress.length < 2) {
    return "상세주소를 2자 이상 입력해주세요.";
  }

  // 1000자 초과 검증
  if (trimmedAddress.length > 1000) {
    return "상세주소는 1000자 이하여야 합니다.";
  }

  return null;
};
