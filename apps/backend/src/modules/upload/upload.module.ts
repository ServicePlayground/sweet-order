import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { AwsService } from "./services/aws.service";

/**
 * 업로드 모듈
 * S3 파일 업로드를 제공합니다.
 */
@Module({
  imports: [],
  providers: [UploadService, AwsService],
  exports: [UploadService],
})
export class UploadModule {}
