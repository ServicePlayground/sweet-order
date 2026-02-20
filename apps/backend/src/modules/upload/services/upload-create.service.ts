import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { FileValidator } from "../utils/file-validator.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 업로드 생성 서비스
 *
 * 파일 업로드 관련 도메인 로직을 담당합니다.
 * S3 클라이언트 초기화 및 파일 업로드를 담당합니다.
 */
@Injectable()
export class UploadCreateService {
  private readonly s3Client: S3Client;
  private readonly bucket?: string;
  private readonly region?: string;
  private readonly cloudfrontDomain?: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>("AWS_REGION");
    this.bucket = this.configService.get<string>("S3_BUCKET");
    this.cloudfrontDomain = this.configService.get<string>("CLOUDFRONT_DOMAIN");

    if (!this.bucket || !this.region) {
      LoggerUtil.log("S3_BUCKET 또는 AWS_REGION 환경 변수가 설정되어 있지 않습니다.");
      throw new Error("S3_BUCKET 또는 AWS_REGION 환경 변수가 설정되어 있지 않습니다.");
    }

    const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>("AWS_SECRET_ACCESS_KEY");

    if (!accessKeyId || !secretAccessKey) {
      LoggerUtil.log("AWS_ACCESS_KEY_ID 또는 AWS_SECRET_ACCESS_KEY가 설정되어 있지 않습니다.");
      throw new Error("AWS_ACCESS_KEY_ID 또는 AWS_SECRET_ACCESS_KEY가 설정되어 있지 않습니다.");
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    LoggerUtil.log(
      `S3 Client 초기화 완료: ${this.region}, Bucket: ${this.bucket}, CloudFront: ${
        this.cloudfrontDomain ? "enabled" : "disabled"
      }`,
    );
  }

  /**
   * 파일을 S3에 직접 업로드
   * 백엔드가 파일을 받아서 S3에 업로드하는 방식
   *
   * @param file 업로드할 파일
   * @returns 업로드된 파일의 URL
   */
  async uploadFile(file: { originalname: string; mimetype: string; buffer: Buffer }) {
    // 파일 검증 (크기, 타입, 이름 등)
    const { uniqueFilename } = FileValidator.validateFile(file);

    try {
      // S3에 업로드
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: uniqueFilename, // 고유 파일명 사용 (경로 탐색 방지 및 중복 방지)
        Body: file.buffer,
        ContentType: file.mimetype,
        // 추가 보안 설정
        ServerSideEncryption: "AES256", // S3 서버 측 암호화
      });

      await this.s3Client.send(command);

      // 최종 파일 URL 생성 (특수문자 URL 인코딩)
      // CloudFront가 설정되어 있으면 CloudFront URL 사용, 없으면 S3 URL 사용
      // S3 URL은 슬래시(/)를 경로 구분자로 사용하므로 각 경로 세그먼트를 개별 인코딩
      const pathSegments = uniqueFilename.split("/").map((segment) => encodeURIComponent(segment));
      const encodedKey = pathSegments.join("/");

      // CloudFront 도메인이 설정되어 있으면 CloudFront URL 사용
      const fileUrl = this.cloudfrontDomain
        ? `https://${this.cloudfrontDomain}/${encodedKey}`
        : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${encodedKey}`;

      LoggerUtil.log(`파일 업로드 완료: ${uniqueFilename} (원본: ${file.originalname})`);

      return fileUrl;
    } catch (error: any) {
      // S3 관련 에러는 내부 서버 에러로 처리
      if (error.name === "S3ServiceException" || error.$metadata?.httpStatusCode >= 500) {
        LoggerUtil.log(`파일 업로드 실패: S3 서버 에러 - error: ${error.message || String(error)}`);
        throw new InternalServerErrorException("파일 업로드 중 서버 오류가 발생했습니다.");
      }

      // 클라이언트 에러는 원본 메시지 유지 (이미 FileValidator에서 로깅됨)
      if (error.name === "BadRequestException" || error instanceof BadRequestException) {
        throw error;
      }

      // 기타 에러는 일반 메시지
      LoggerUtil.log(
        `파일 업로드 실패: 알 수 없는 에러 - error: ${error.message || String(error)}`,
      );
      throw new BadRequestException("파일 업로드에 실패했습니다. 파일 형식과 크기를 확인해주세요.");
    }
  }
}
