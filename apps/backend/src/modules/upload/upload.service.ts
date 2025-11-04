import { Injectable } from "@nestjs/common";
import { AwsService } from "./services/aws.service";

/**
 * 업로드 서비스
 *
 * 모든 업로드 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * AwsService를 조합하여 사용합니다.
 */
@Injectable()
export class UploadService {
  constructor(private readonly awsService: AwsService) {}

  /**
   * 파일 업로드 (백엔드 내부에서 S3 업로드 처리)
   * 프론트엔드에서 파일을 받아서 백엔드가 S3에 업로드하는 방식
   */
  async uploadFile(
    file: { originalname: string; mimetype: string; buffer: Buffer },
  ) {
    return await this.awsService.uploadFile(file);
  }
}

