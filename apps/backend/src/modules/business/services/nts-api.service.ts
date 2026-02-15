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

    // axios 인스턴스 생성 (타임아웃 설정 포함)
    this.axiosInstance = axios.create({
      baseURL: this.ntsApiUrl,
      timeout: 10000, // 10초 타임아웃
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 재시도 로직이 포함된 API 호출
   * @param apiCall API 호출 함수
   * @param maxRetries 최대 재시도 횟수
   * @returns API 응답
   */
  private async callWithRetry<T>(apiCall: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error: any) {
        lastError = error;

        // 재시도 가능한 에러인지 확인 (네트워크 에러, 타임아웃, 5xx 에러)
        const isRetryable =
          error.code === "ECONNABORTED" || // 타임아웃
          error.code === "ETIMEDOUT" || // 연결 타임아웃
          error.code === "ECONNRESET" || // 연결 리셋
          error.code === "ENOTFOUND" || // DNS 에러
          (error.response?.status >= 500 && error.response?.status < 600); // 5xx 서버 에러

        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }

        // 지수 백오프: 1초, 2초, 4초
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
        this.logger.warn(
          `국세청 API 호출 실패 (${attempt}/${maxRetries}), ${delayMs}ms 후 재시도...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw lastError;
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

      // TODO: (임시) 반드시 주석 해제 필요
      /*
      // 사업자등록번호 정규화 (하이픈 제거)
      const normalizedBusinessNumber = validationDto.b_no.replace(/[-\s]/g, "");

      // 국세청 API 호출 (재시도 로직 포함)
      const baseBusinessPayload: Record<string, string> = {
        b_no: normalizedBusinessNumber,
        start_dt: validationDto.start_dt,
        p_nm: validationDto.p_nm,
        b_nm: validationDto.b_nm,
        b_sector: validationDto.b_sector,
        b_type: validationDto.b_type,
      };

      const response = await this.callWithRetry(() =>
        this.axiosInstance.post(
          `${this.ntsApiUrl}/nts-businessman/v1/validate?serviceKey=${this.dataGoKrApiKey}`,
          {
            businesses: [baseBusinessPayload],
          },
        ),
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
      */
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
