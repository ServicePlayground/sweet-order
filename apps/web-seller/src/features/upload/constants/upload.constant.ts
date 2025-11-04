export const UPLOAD_CONSTANTS = {
  // 허용된 파일 확장자
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png"] as readonly string[],

  // 최대 파일 크기 (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
} as const;
