import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { OnlineTradingCompanyDetailRequestDto } from "@apps/backend/modules/business/dto/business-request.dto";
import { KFTC_API_ERROR_MESSAGES } from "@apps/backend/modules/business/constants/business.contants";

/**
 * 공정거래위원회 통신판매사업자 등록상세 조회 API 전용 서비스
 * 공정거래위원회 API 호출 및 응답 처리를 담당합니다.
 */
@Injectable()
export class KftcApiService {
  private readonly logger = new Logger(KftcApiService.name);
  private readonly kftcApiUrl?: string;
  private readonly dataGoKrApiKey?: string;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.kftcApiUrl = this.configService.get<string>("KFTC_API_URL");
    this.dataGoKrApiKey = this.configService.get<string>("DATA_GO_KR_API_KEY");

    if (!this.kftcApiUrl || !this.dataGoKrApiKey) {
      throw new Error("KFTC_API_URL 또는 DATA_GO_KR_API_KEY가 설정되지 않았습니다.");
    }

    // axios 인스턴스 생성 (타임아웃 설정 포함)
    this.axiosInstance = axios.create({
      baseURL: this.kftcApiUrl,
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
          `공정거래위원회 API 호출 실패 (${attempt}/${maxRetries}), ${delayMs}ms 후 재시도...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw lastError;
  }

  /**
   * 통신판매사업자 등록상세 조회
   * @param detailDto 통신판매사업자 등록상세 조회 요청 데이터
   */
  async getOnlineTradingCompanyDetail(detailDto: OnlineTradingCompanyDetailRequestDto) {
    try {
      if (!this.kftcApiUrl || !this.dataGoKrApiKey) {
        throw new Error("KFTC_API_URL 또는 DATA_GO_KR_API_KEY가 설정되지 않았습니다.");
      }

      // TODO: (임시) 반드시 주석 해제 필요
      /*
      // 사업자등록번호 정규화 (하이픈 제거)
      const normalizedBusinessNumber = detailDto.brno.replace(/[-\s]/g, "");

      // API 파라미터 구성
      const params: Record<string, string | number> = {
        serviceKey: decodeURIComponent(this.dataGoKrApiKey),
        pageNo: 1,
        numOfRows: 10,
        resultType: "json",
        brno: normalizedBusinessNumber,
        prmmiMnno: detailDto.prmmiMnno,
      };

      // 공정거래위원회 통신판매사업자 등록상세 조회 API 호출 (재시도 로직 포함)
      // https://www.data.go.kr/iim/api/selectAPIAcountView.do
      const response = await this.callWithRetry(() =>
        this.axiosInstance.get(`/1130000/MllBsDtl_3Service/getMllBsInfoDetail_3`, {
          params,
        }),
      );

      const items = response.data.items;
      // 데이터가 없는 경우
      if (!items || items.length === 0) {
        throw new Error(KFTC_API_ERROR_MESSAGES.ONLINE_TRADING_COMPANY_DETAIL_NOT_FOUND);
      }

      // 첫 번째 항목 사용 (일반적으로 하나만 조회됨)
      const detail = items[0];

      // 법적 필수 검증 조건 확인
      // 운영상태가 null/undefined이거나 "정상영업"이 아닌 경우 오류 처리
      if (!detail.operSttusCdNm || detail.operSttusCdNm !== "정상영업") {
        throw new BadRequestException(KFTC_API_ERROR_MESSAGES.OPERATION_STATUS_NOT_NORMAL);
      */
    } catch (error: any) {
      if (error.message) {
        throw new BadRequestException(error.message);
      }

      const statusCode = error.response?.data?.resultCode;
      const errorMessage =
        KFTC_API_ERROR_MESSAGES[statusCode as keyof typeof KFTC_API_ERROR_MESSAGES];

      this.logger.error(`통신판매사업자 등록상세 조회 실패: ${errorMessage}`);
      throw new BadRequestException(errorMessage);
    }
  }
}
