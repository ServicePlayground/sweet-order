import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { BusinessValidationRequestDto } from "@apps/backend/modules/business/dto/business-request.dto";
import { BUSINESS_STATUS_CODE, NTS_API_ERROR_MESSAGES } from "@apps/backend/modules/business/constants/business.contants";

/**
 * 국세청 사업자등록정보 진위확인·상태조회 API 전용 서비스
 * 국세청 API 호출 및 응답 처리를 담당합니다.
 */
@Injectable()
export class NtsApiService {
  private readonly logger = new Logger(NtsApiService.name);
  private readonly ntsApiUrl?: string;
  private readonly ntsApiKey?: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.ntsApiUrl = this.configService.get<string>("NTS_API_URL");
    this.ntsApiKey = this.configService.get<string>("NTS_API_KEY");
    
    if (!this.ntsApiUrl || !this.ntsApiKey) {
      throw new Error("NTS_API_URL 또는 NTS_API_KEY가 설정되지 않았습니다.");
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
   * @returns 진위확인 결과
   */
  async verifyBusinessRegistration(
    validationDto: BusinessValidationRequestDto,
  ) {
    try {
      if (!this.ntsApiUrl) {
        throw new Error("NTS_API_URL가 설정되지 않았습니다.");
      }

      // 사업자등록번호 정규화 (하이픈 제거)
      const normalizedBusinessNumber = validationDto.businessRegistrationNumber.replace(/[-\s]/g, "");

      // 국세청 API 호출 (https://www.data.go.kr/data/15081808/openapi.do?utm_source=chatgpt.com#/%EC%82%AC%EC%97%85%EC%9E%90%EB%93%B1%EB%A1%9D%EC%A0%95%EB%B3%B4%20%EC%A7%84%EC%9C%84%ED%99%95%EC%9D%B8%20API/validate)
      const response = await this.axiosInstance.post(`${this.ntsApiUrl}/nts-businessman/v1/validate?serviceKey=${this.ntsApiKey}`, {
        "businesses": [
          {
            "b_no": normalizedBusinessNumber, // 사업자등록번호
            "start_dt": validationDto.openingDate, // 개업일자
            "p_nm": validationDto.representativeName, // 대표자명
          }
        ]
      });

      if (response.data?.data[0]?.valid === BUSINESS_STATUS_CODE.INACTIVE) {
        throw new Error(response.data?.data[0]?.valid_msg);
      }

      if (response.data?.data[0]?.status.b_stt_cd === BUSINESS_STATUS_CODE.INACTIVE || response.data?.data[0]?.status.b_stt_cd === BUSINESS_STATUS_CODE.CLOSED) {
        throw new Error(NTS_API_ERROR_MESSAGES.BUSINESS_STATUS_INACTIVE);
      }

      return {request: response.data?.data[0]?.request_param, response: response.data?.data[0]?.status};

    } catch (error: any) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }

      const statusCode = error.response?.data?.status_code;
      const errorMessage = NTS_API_ERROR_MESSAGES[statusCode as keyof typeof NTS_API_ERROR_MESSAGES];

      this.logger.error(`사업자등록번호 진위확인 실패: ${errorMessage}`);
      throw new BadRequestException(errorMessage);
    }
  }
}
