import { applyDecorators } from "@nestjs/common";
import { ApiResponse as SwaggerApiResponse } from "@nestjs/swagger";
import {
  HTTP200ResponseDto,
  HTTP400ResponseDto,
  HTTP401ResponseDto,
  HTTP404ResponseDto,
  HTTP409ResponseDto,
  HTTP500ResponseDto,
} from "@web-user/backend/common/dto/response.dto";

/**
 * API 응답 데코레이터
 * Swagger 문서 생성을 위한 표준화된 응답 데코레이터
 */
export function ApiResponse(statuses: number[] = [200, 400, 401, 404, 409, 500]): MethodDecorator {
  const decorators: any[] = [];

  const statusMap: Record<number, { description: string; type: any }> = {
    200: { description: "요청 성공", type: HTTP200ResponseDto },
    400: { description: "잘못된 요청", type: HTTP400ResponseDto },
    401: { description: "권한 없음", type: HTTP401ResponseDto },
    404: { description: "리소스를 찾을 수 없음", type: HTTP404ResponseDto },
    409: { description: "중복된 사용자 정보", type: HTTP409ResponseDto },
    500: { description: "서버 내부 오류", type: HTTP500ResponseDto },
  };

  statuses.forEach((status) => {
    if (statusMap[status]) {
      decorators.push(
        SwaggerApiResponse({
          status,
          description: statusMap[status].description,
          type: statusMap[status].type,
        }),
      );
    }
  });

  return applyDecorators(...decorators);
}
