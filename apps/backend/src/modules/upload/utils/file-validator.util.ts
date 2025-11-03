import { BadRequestException } from "@nestjs/common";
import { UPLOAD_CONSTANTS } from "../constants/upload.constants";
import * as path from "path";
import * as crypto from "crypto";

/**
 * 파일 검증 유틸리티
 */
export class FileValidator {
  /**
   * 파일 크기 검증
   */
  static validateFileSize(buffer: Buffer): void {
    if (buffer.length > UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `파일 크기는 ${UPLOAD_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB를 초과할 수 없습니다.`,
      );
    }

    if (buffer.length === 0) {
      throw new BadRequestException("빈 파일은 업로드할 수 없습니다.");
    }
  }

  /**
   * 파일 확장자 검증
   */
  static validateFileExtension(filename: string): void {
    const ext = path.extname(filename).toLowerCase();

    // 확장자가 없는 경우
    if (!ext) {
      throw new BadRequestException("파일 확장자가 필요합니다.");
    }

    // 차단된 확장자인 경우
    if (UPLOAD_CONSTANTS.BLOCKED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(`업로드가 허용되지 않은 파일 형식입니다: ${ext}`);
    }

    // 허용된 확장자인지 확인
    if (!UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(`지원하지 않는 파일 형식입니다: ${ext}`);
    }
  }

  /**
   * MIME 타입 검증
   */
  static validateMimeType(mimetype: string): void {
    if (!mimetype || typeof mimetype !== "string") {
      throw new BadRequestException("파일 타입 정보가 올바르지 않습니다.");
    }

    if (!UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.includes(mimetype)) {
      throw new BadRequestException(`지원하지 않는 파일 타입입니다: ${mimetype}`);
    }
  }

  /**
   * 파일 이름 검증 및 정규화
   * - 경로 탐색 공격 방지
   * - 특수문자 제거/치환
   */
  static normalizeFilename(originalname: string): string {
    if (!originalname || typeof originalname !== "string") {
      throw new BadRequestException("파일 이름이 올바르지 않습니다.");
    }

    // 경로 탐색 공격 방지 (../ 제거)
    let normalized = path.basename(originalname);

    // 파일 이름 길이 제한
    if (normalized.length > UPLOAD_CONSTANTS.MAX_FILENAME_LENGTH) {
      const ext = path.extname(normalized);
      const nameWithoutExt = normalized.slice(0, UPLOAD_CONSTANTS.MAX_FILENAME_LENGTH - ext.length);
      normalized = nameWithoutExt + ext;
    }

    // 특수문자 제거/치환 (안전한 문자만 허용)
    // 한글, 영문, 숫자, 하이픈, 언더스코어, 점만 허용
    normalized = normalized.replace(/[^가-힣a-zA-Z0-9._-]/g, "_");

    // 연속된 언더스코어 제거
    normalized = normalized.replace(/_+/g, "_");

    // 시작/끝 언더스코어 제거
    normalized = normalized.replace(/^_+|_+$/g, "");

    // 빈 문자열 체크
    if (!normalized || normalized.trim() === "") {
      throw new BadRequestException("유효한 파일 이름을 생성할 수 없습니다.");
    }

    return normalized;
  }

  /**
   * 고유한 파일 이름 생성
   * 기존 파일과 충돌 방지를 위해 타임스탬프와 랜덤 문자열을 추가
   */
  static generateUniqueFilename(originalname: string): string {
    const normalized = this.normalizeFilename(originalname);
    const ext = path.extname(normalized);
    const nameWithoutExt = path.basename(normalized, ext);

    // 타임스탬프 + 랜덤 문자열 생성
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");

    // 고유 파일명: 원본이름_타임스탬프_랜덤.확장자
    const uniqueName = `${nameWithoutExt}_${timestamp}_${randomString}${ext}`;

    return `${UPLOAD_CONSTANTS.UPLOAD_DIRECTORY}/${uniqueName}`;
  }

  /**
   * 파일 확장자와 MIME 타입 일치 검증
   * 클라이언트가 주장하는 mimetype과 실제 확장자가 일치하는지 확인
   */
  static validateExtensionMimeTypeMatch(filename: string, mimetype: string): void {
    const ext = path.extname(filename).toLowerCase();

    // 확장자별 예상 MIME 타입 매핑
    const extensionMimeMap: Record<string, string[]> = {
      ".jpg": ["image/jpeg", "image/jpg"],
      ".jpeg": ["image/jpeg", "image/jpg"],
      ".png": ["image/png"],
      ".gif": ["image/gif"],
      ".webp": ["image/webp"],
      ".svg": ["image/svg+xml"],
      ".pdf": ["application/pdf"],
      ".doc": ["application/msword"],
      ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      ".xls": ["application/vnd.ms-excel"],
      ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
      ".txt": ["text/plain"],
    };

    const expectedMimes = extensionMimeMap[ext];
    if (!expectedMimes) {
      throw new BadRequestException(`지원하지 않는 파일 확장자입니다: ${ext}`);
    }

    if (!expectedMimes.includes(mimetype)) {
      throw new BadRequestException(
        `파일 확장자(${ext})와 MIME 타입(${mimetype})이 일치하지 않습니다.`,
      );
    }
  }

  /**
   * 전체 파일 검증 (통합)
   */
  static validateFile(file: {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
  }): {
    normalizedFilename: string;
    uniqueFilename: string;
  } {
    // 기본 필수 필드 검증
    if (!file || !file.originalname || !file.buffer || !file.mimetype) {
      throw new BadRequestException("파일 정보가 올바르지 않습니다.");
    }

    // 파일 크기 검증
    this.validateFileSize(file.buffer);

    // 파일 확장자 검증
    this.validateFileExtension(file.originalname);

    // MIME 타입 검증
    this.validateMimeType(file.mimetype);

    // 확장자와 MIME 타입 일치 검증
    this.validateExtensionMimeTypeMatch(file.originalname, file.mimetype);

    // 파일 이름 정규화
    const normalizedFilename = this.normalizeFilename(file.originalname);

    // 고유 파일 이름 생성
    const uniqueFilename = this.generateUniqueFilename(file.originalname);

    return {
      normalizedFilename,
      uniqueFilename,
    };
  }
}

