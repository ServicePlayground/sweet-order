import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { BusinessValidationRequestDto } from "@apps/backend/modules/business/dto/business-request.dto";
import {
  B_STT_CD,
  NTS_API_ERROR_MESSAGES,
} from "@apps/backend/modules/business/constants/business.contants";

/**
 * 국세청 사업자등록정보 진위확인·상태조회 API 전용 서비스
 * 국세청 API 호출 및 응답 처리를 담당합니다.
 */
@Injectable()
export class NtsApiService {
  private readonly logger = new Logger(NtsApiService.name);
  private readonly ntsApiUrl?: string;
  private readonly dataGoKrApiKey?: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.ntsApiUrl = this.configService.get<string>("NTS_API_URL");
    this.dataGoKrApiKey = this.configService.get<string>("DATA_GO_KR_API_KEY");

    if (!this.ntsApiUrl || !this.dataGoKrApiKey) {
      throw new Error("NTS_API_URL 또는 DATA_GO_KR_API_KEY가 설정되지 않았습니다.");
    }

    // axios 인스턴스 생성
    this.axiosInstance = axios.create({
      baseURL: this.ntsApiUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 사업자등록번호 진위확인
   * @param validationDto 사업자등록번호 진위확인 요청 데이터
   */
  async verifyBusinessRegistration(validationDto: BusinessValidationRequestDto) {
    try {
      if (!this.ntsApiUrl) {
        throw new Error("NTS_API_URL가 설정되지 않았습니다.");
      }

      // 사업자등록번호 정규화 (하이픈 제거)
      const normalizedBusinessNumber = validationDto.b_no.replace(/[-\s]/g, "");

      // 국세청 API 호출 (https://www.data.go.kr/data/15081808/openapi.do?utm_source=chatgpt.com#/%EC%82%AC%EC%97%85%EC%9E%90%EB%93%B1%EB%A1%9D%EC%A0%95%EB%B3%B4%20%EC%A7%84%EC%9C%84%ED%99%95%EC%9D%B8%20API/validate)
      const baseBusinessPayload: Record<string, string> = {
        b_no: normalizedBusinessNumber,
        start_dt: validationDto.start_dt,
        p_nm: validationDto.p_nm,
        b_nm: validationDto.b_nm,
        b_sector: validationDto.b_sector,
        b_type: validationDto.b_type,
      };

      const response = await this.axiosInstance.post(
        `${this.ntsApiUrl}/nts-businessman/v1/validate?serviceKey=${this.dataGoKrApiKey}`,
        {
          businesses: [baseBusinessPayload],
        },
      );

      // 응답 데이터 존재 여부 확인
      if (!response.data?.data?.[0]) {
        throw new Error(NTS_API_ERROR_MESSAGES.DATA_NOT_FOUND);
      }

      const responseData = response.data.data[0];

      // 법적 필수 검증 조건 확인
      if (responseData.valid === B_STT_CD.INACTIVE) {
        throw new Error(responseData.valid_msg);
      }
      if (
        responseData.status?.b_stt_cd === B_STT_CD.INACTIVE ||
        responseData.status?.b_stt_cd === B_STT_CD.CLOSED
      ) {
        throw new Error(NTS_API_ERROR_MESSAGES.BUSINESS_STATUS_INACTIVE);
      }
    } catch (error: any) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }

      const statusCode = error.response?.data?.status_code;
      const errorMessage =
        NTS_API_ERROR_MESSAGES[statusCode as keyof typeof NTS_API_ERROR_MESSAGES];

      this.logger.error(`사업자등록번호 진위확인 실패: ${errorMessage}`);
      throw new BadRequestException(errorMessage);
    }
  }
}
