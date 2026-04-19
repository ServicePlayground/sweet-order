import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiExtraModels } from "@nestjs/swagger";
import { UploadService } from "@apps/backend/modules/upload/upload.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { SwaggerAuthResponses } from "@apps/backend/common/decorators/swagger-auth-responses.decorator";
import { AUDIENCE } from "@apps/backend/modules/auth/constants/auth.constants";
import {
  UPLOAD_CONSTANTS,
  UPLOAD_ERROR_MESSAGES,
} from "@apps/backend/modules/upload/constants/upload.constants";
import { UploadFileResponseDto } from "@apps/backend/modules/upload/dto/upload-create.dto";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 판매자 전용 업로드 (JWT aud: seller)
 */
@ApiTags("[판매자] 업로드")
@ApiExtraModels(UploadFileResponseDto)
@Controller(`${AUDIENCE.SELLER}/uploads`)
@Auth({ isPublic: false, audiences: ["seller"] })
export class SellerUploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("file")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE,
      },
    }),
  )
  @ApiOperation({
    summary: "(로그인 필요) 파일 업로드",
    description: `판매자 토큰으로 S3 업로드 후 URL 반환. 최대 ${UPLOAD_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: `업로드할 파일 (최대 ${UPLOAD_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB)`,
        },
      },
    },
  })
  @SwaggerResponse(200, { dataDto: UploadFileResponseDto })
  @SwaggerAuthResponses()
  async uploadFile(
    @UploadedFile()
    file:
      | {
          originalname: string;
          mimetype: string;
          buffer: Buffer;
        }
      | undefined,
  ) {
    if (!file) {
      LoggerUtil.log(UPLOAD_ERROR_MESSAGES.FILE_NOT_UPLOADED);
      throw new BadRequestException(UPLOAD_ERROR_MESSAGES.FILE_NOT_UPLOADED);
    }

    const fileUrl = await this.uploadService.uploadFile({
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer,
    });

    return { fileUrl };
  }
}
