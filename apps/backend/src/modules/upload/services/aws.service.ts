import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { FileValidator } from "../utils/file-validator.util";

/**
 * AWS S3 전용 서비스
 * S3 클라이언트 초기화 및 파일 업로드를 담당합니다.
 */
@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  private readonly s3Client: S3Client;
  private readonly bucket?: string;
  private readonly region?: string;  
  private readonly cloudfrontDomain?: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>("AWS_REGION");
    this.bucket = this.configService.get<string>("S3_BUCKET");
    this.cloudfrontDomain = this.configService.get<string>("CLOUDFRONT_DOMAIN");

    if (!this.bucket || !this.region || !this.cloudfrontDomain) {
      throw new Error("S3_BUCKET 또는 AWS_REGION 또는 CLOUDFRONT_DOMAIN 환경 변수가 설정되어 있지 않습니다.");
    }

    const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>("AWS_SECRET_ACCESS_KEY");

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("AWS_ACCESS_KEY_ID 또는 AWS_SECRET_ACCESS_KEY가 설정되어 있지 않습니다.");
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.logger.log(`S3 Client 초기화 완료: ${this.region}, Bucket: ${this.bucket}`);
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

      this.logger.debug(`파일 업로드 완료: ${uniqueFilename} (원본: ${file.originalname})`);

      return fileUrl;
    } catch (error: any) {
      this.logger.error(`파일 업로드 실패: ${error.message}`, error.stack);
      // 민감한 정보 노출 방지 (스택 트레이스는 로그에만 기록)
      throw new BadRequestException("파일 업로드에 실패했습니다. 파일 형식과 크기를 확인해주세요.");
    }
  }
}

