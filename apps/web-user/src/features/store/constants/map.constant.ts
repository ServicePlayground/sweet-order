import { REGION_COORDINATES } from "@/apps/web-user/common/constants/region-coordinates.constant";
import { ProductCategoryType } from "@/apps/web-user/features/product/types/product.type";

/** 지도 기본 중심 (현재위치 없을 때, 강남구) */
export const DEFAULT_MAP_CENTER = REGION_COORDINATES["서울"]?.["강남구"] ?? {
  lat: 37.5172,
  lng: 127.0473,
};

/** 목록 패널 핸들 높이(px) */
export const LIST_SHEET_HANDLE_HEIGHT = 32;

/** 하단 네비 영역 높이(px) - 패널이 채우는 최대 높이 계산용 */
export const LIST_SHEET_BOTTOM_NAV_HEIGHT = 60;

/** 목록 패널 중간단계: 화면 높이 대비 비율 (0.45 = 45vh) */
export const LIST_SHEET_OPEN_RATIO = 0.45;

/** 지도 bounds 패딩(px) - 검색 결과 전체가 보이도록 할 때 */
export const MAP_BOUNDS_PADDING = 80;

/** 카카오 키워드 검색 시 사용하는 키워드 (미입점 마커) */
export const KAKAO_PLACES_KEYWORD = "주문제작 케이크";

/** 지도 목록 필터: 사이즈 옵션 (백엔드 CakeSizeDisplayName 표시명과 동일) */
export const MAP_LIST_SIZE_OPTIONS: string[] = ["도시락", "미니", "1호", "2호", "3호"];

/** 지도 목록 필터: 유형 옵션 (API ProductCategoryType 값, 라벨) */
export const MAP_LIST_CATEGORY_OPTIONS: { value: ProductCategoryType; label: string }[] = [
  { value: ProductCategoryType.BIRTHDAY, label: "생일" },
  { value: ProductCategoryType.LOVER, label: "연인" },
  { value: ProductCategoryType.FRIEND, label: "친구" },
  { value: ProductCategoryType.FAMILY, label: "가족" },
  { value: ProductCategoryType.ANNIVERSARY, label: "기념일" },
  { value: ProductCategoryType.SAME_DAY_PICKUP, label: "당일픽업" },
  { value: ProductCategoryType.LETTERING, label: "레터링" },
  { value: ProductCategoryType.CHARACTER, label: "캐릭터" },
  { value: ProductCategoryType.SIMPLE, label: "심플" },
  { value: ProductCategoryType.FLOWER, label: "꽃" },
  { value: ProductCategoryType.PHOTO, label: "사진" },
];
