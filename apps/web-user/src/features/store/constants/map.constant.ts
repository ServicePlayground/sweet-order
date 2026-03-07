import { REGION_COORDINATES } from "@/apps/web-user/common/constants/region-coordinates.constant";

/** 지도 기본 중심 (현재위치 없을 때, 강남구) */
export const DEFAULT_MAP_CENTER =
  REGION_COORDINATES["서울"]?.["강남구"] ?? { lat: 37.5172, lng: 127.0473 };

/** 목록 패널 핸들 높이(px) */
export const LIST_SHEET_HANDLE_HEIGHT = 32;

/** 목록 패널 열림 시 화면 높이 대비 비율 (0.45 = 45vh) */
export const LIST_SHEET_OPEN_RATIO = 0.45;

/** 드래그 후 스냅 기준: 이 값 이상이면 풀 오픈, 미만이면 접힘 */
export const LIST_SHEET_SNAP_THRESHOLD = 120;

/** 지도 bounds 패딩(px) - 검색 결과 전체가 보이도록 할 때 */
export const MAP_BOUNDS_PADDING = 80;

/** 카카오 키워드 검색 시 사용하는 키워드 (미입점 마커) */
export const KAKAO_PLACES_KEYWORD = "주문제작 케이크";
