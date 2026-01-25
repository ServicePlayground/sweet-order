import { SWAGGER_EXAMPLES as BUSINESS_SWAGGER_EXAMPLES } from "@apps/backend/modules/business/constants/business.contants";
import { SWAGGER_EXAMPLES as USER_SWAGGER_EXAMPLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { SWAGGER_EXAMPLES as UPLOAD_SWAGGER_EXAMPLES } from "@apps/backend/modules/upload/constants/upload.constants";

export const STORE_ERROR_MESSAGES = {
  BUSINESS_REGISTRATION_NUMBER_MISMATCH:
    "1단계(사업자등록번호 진위확인)와 2단계(통신판매사업자 등록상세 조회)의 사업자등록번호가 일치하지 않습니다.",
  STORE_ALREADY_EXISTS_WITH_SAME_BUSINESS_INFO:
    "같은 사업자등록번호와 인허가관리번호(통신판매사업자 신고번호) 조합으로 이미 스토어가 존재합니다.",
  NOT_FOUND: "스토어를 찾을 수 없습니다.",
  LIKE_ALREADY_EXISTS: "이미 좋아요한 스토어입니다.",
  LIKE_NOT_FOUND: "좋아요한 스토어가 아닙니다.",
} as const;

export const STORE_SUCCESS_MESSAGES = {
  STORE_CREATED: "스토어가 생성되었습니다.",
  LIKE_ADDED: "스토어에 좋아요를 추가했습니다.",
  LIKE_REMOVED: "스토어 좋아요를 취소했습니다.",
} as const;

export const SWAGGER_EXAMPLES = {
  ID: "QXZw02vBqVXNQ29c4w9n9ZdG",
  NAME: "스위트오더 스토어",
  DESCRIPTION: "맛있는 케이크를 판매하는 스토어입니다.",
  CREATED_AT: new Date("2024-01-01T00:00:00.000Z"),
};

const STORE_DETAIL_RESPONSE_EXAMPLE = {
  id: SWAGGER_EXAMPLES.ID,
  userId: USER_SWAGGER_EXAMPLES.USER_DATA.id,
  logoImageUrl: UPLOAD_SWAGGER_EXAMPLES.FILE_URL,
  name: SWAGGER_EXAMPLES.NAME,
  description: SWAGGER_EXAMPLES.DESCRIPTION,
  businessNo: BUSINESS_SWAGGER_EXAMPLES.B_NO,
  representativeName: BUSINESS_SWAGGER_EXAMPLES.P_NM,
  openingDate: BUSINESS_SWAGGER_EXAMPLES.START_DT,
  businessName: BUSINESS_SWAGGER_EXAMPLES.B_NM,
  businessSector: BUSINESS_SWAGGER_EXAMPLES.B_SECTOR,
  businessType: BUSINESS_SWAGGER_EXAMPLES.B_TYPE,
  permissionManagementNumber: BUSINESS_SWAGGER_EXAMPLES.PRMMI_MNNO,
  likeCount: 25,
  averageRating: 4.5,
  totalReviewCount: 42,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

export const SWAGGER_RESPONSE_EXAMPLES = {
  STORE_CREATED_RESPONSE: {
    id: SWAGGER_EXAMPLES.ID,
  },
  STORE_LIST_RESPONSE: {
    stores: [STORE_DETAIL_RESPONSE_EXAMPLE],
  },
  STORE_DETAIL_RESPONSE: STORE_DETAIL_RESPONSE_EXAMPLE,
};
