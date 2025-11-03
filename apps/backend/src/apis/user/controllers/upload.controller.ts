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
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { UploadService } from "@apps/backend/modules/upload/upload.service";
import { UploadFileResponseDto } from "@apps/backend/modules/upload/dto/upload-response.dto";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { AUTH_ERROR_MESSAGES, USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { UPLOAD_CONSTANTS } from "@apps/backend/modules/upload/constants/upload.constants";

/**
 * 사용자 업로드 컨트롤러
 * 파일 업로드를 제공합니다.
 */
@ApiTags("[사용자, 판매자, 관리자] 업로드")
@Controller(`${USER_ROLES.USER}/uploads`)
@Auth({ isPublic: false, roles: ["USER", "SELLER", "ADMIN"] }) // 로그인 필요
export class UserUploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 파일 업로드 API
   * 백엔드가 파일을 받아서 S3에 업로드하고 최종 URL을 반환합니다.
   */
  @Post("file")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE, // 파일 크기 제한 (10MB)
      },
    }),
  ) // 내부적으로 multer를 사용해 multipart/form-data 파싱
  @ApiOperation({
    summary: "(로그인 필요) 파일 업로드",
    description: `파일을 백엔드로 전송하면 백엔드가 내부에서 S3에 업로드하고 파일 URL을 반환합니다. 최대 파일 크기: ${UPLOAD_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
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
  @SwaggerResponse(200, UploadFileResponseDto)
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  async uploadFile(
    @UploadedFile()
    file:
      | {
          originalname: string;
          mimetype: string;
          buffer: Buffer;
        }
      | undefined,
  ): Promise<UploadFileResponseDto> {
    if (!file) {
      throw new BadRequestException("파일이 업로드되지 않았습니다.");
    }

    const fileUrl = await this.uploadService.uploadFile({
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer,
    });

    return { fileUrl };
  }
}

