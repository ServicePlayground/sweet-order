import { Module } from "@nestjs/common";
import { UploadService } from "@apps/backend/modules/upload/upload.service";
import { UploadCreateService } from "@apps/backend/modules/upload/services/upload-create.service";

/**
 * 업로드 모듈
 * S3 파일 업로드를 제공합니다.
 */
@Module({
  imports: [],
  providers: [UploadService, UploadCreateService],
  exports: [UploadService],
})
export class UploadModule {}
