import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { OnlineTradingCompanyDetailRequestDto } from "@apps/backend/modules/business/dto/business-request.dto";
import {
  KFTC_API_ERROR_MESSAGES,
  BUSINESS_ERROR_MESSAGES,
} from "@apps/backend/modules/business/constants/business.contants";

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

    // axios 인스턴스 생성
    this.axiosInstance = axios.create({
      baseURL: this.kftcApiUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 통신판매사업자 등록상세 조회
   * @param detailDto 통신판매사업자 등록상세 조회 요청 데이터
   * @returns 통신판매사업자 등록상세 정보
   */
  async getOnlineTradingCompanyDetail(detailDto: OnlineTradingCompanyDetailRequestDto) {
    try {
      if (!this.kftcApiUrl || !this.dataGoKrApiKey) {
        throw new Error("KFTC_API_URL 또는 DATA_GO_KR_API_KEY가 설정되지 않았습니다.");
      }

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

      // 공정거래위원회 통신판매사업자 등록상세 조회 API 호출
      // https://www.data.go.kr/iim/api/selectAPIAcountView.do
      const response = await this.axiosInstance.get(
        `/1130000/MllBsDtl_3Service/getMllBsInfoDetail_3`,
        {
          params,
        },
      );

      const items = response.data.items;
      // 데이터가 없는 경우
      if (!items || items.length === 0) {
        throw new Error(KFTC_API_ERROR_MESSAGES.ONLINE_TRADING_COMPANY_DETAIL_NOT_FOUND);
      }

      // 첫 번째 항목 사용 (일반적으로 하나만 조회됨)
      const detail = items[0];

      // 법적 필수 검증 조건 확인
      if (detail.operSttusCdNm && detail.operSttusCdNm !== "정상영업") {
        throw new BadRequestException(KFTC_API_ERROR_MESSAGES.OPERATION_STATUS_NOT_NORMAL);
      }

      return detail;
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
