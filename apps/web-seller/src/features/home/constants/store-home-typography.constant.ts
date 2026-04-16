/**
 * 스토어 홈 대시보드 타이포그래피 토큰.
 * CardTitle는 기본 `font-semibold`이므로 제목은 크기·색만 맞춥니다.
 */
export const HOME_PAGE_TITLE =
  "text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl";

/** 페이지 상단 제목 (예: 스토어 홈) */
export const HOME_SCREEN_HEADING = "text-3xl font-bold tracking-tight text-foreground";

/** 카드 헤더 제목 (CardTitle) */
export const HOME_CARD_TITLE = "text-base text-foreground";

/** 카드·블록 안 소제목 (픽업 장소 등) */
export const HOME_BLOCK_TITLE = "text-sm font-semibold text-foreground";

/** 본문 */
export const HOME_BODY = "text-sm text-foreground";
export const HOME_BODY_MUTED = "text-sm text-muted-foreground";

/** 강조 본문 */
export const HOME_EMPHASIS = "text-sm font-semibold text-foreground";

/** 라벨·캡션 */
export const HOME_LABEL = "text-xs font-medium text-muted-foreground";
export const HOME_CAPTION = "text-xs text-muted-foreground";

/** 큰 지표 숫자 (매출·건수·프로필 지표 등) */
export const HOME_NUMBER_KPI = "text-xl font-semibold tabular-nums tracking-tight text-foreground";

/** 본문 속 숫자·금액 */
export const HOME_NUMBER = "text-sm tabular-nums text-foreground";
export const HOME_NUMBER_MUTED = "text-sm tabular-nums text-muted-foreground";

/** 테이블 */
export const HOME_TABLE_HEAD = "text-sm font-medium text-muted-foreground";
export const HOME_TABLE_CELL = "text-sm text-foreground";

/** 주문번호 등 고정폭 */
export const HOME_MONO = "font-mono text-sm tabular-nums text-foreground";

/** 캘린더 미리보기 — 월 표시 */
export const HOME_CALENDAR_MONTH = "text-base font-semibold text-foreground";

/** 캘린더 미리보기 — 일자 숫자 */
export const HOME_CALENDAR_DAY_NUM =
  "text-lg font-semibold tabular-nums leading-none text-foreground sm:text-xl";

/** 캘린더 셀 보조 텍스트 */
export const HOME_CALENDAR_CELL_META = "text-xs font-medium leading-tight";
export const HOME_CALENDAR_WEEKDAY = "text-sm font-semibold text-muted-foreground";

/** 홈 대시보드(프로필 제외) 공통 레이아웃 */
export const HOME_SECTION_GAP = "space-y-6";
export const HOME_GRID_2_COL = "grid grid-cols-1 gap-6 lg:grid-cols-2";

/** 카드 공통 */
export const HOME_CARD = "border-border bg-card";
/**
 * 제목 행 + 우측 액션 버튼. `CardHeader` 기본 `p-6`과 병합 시 하단만 `pb-2`로 줄여 본문과 간격을 맞춥니다.
 */
export const HOME_CARD_HEADER =
  "flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-2 sm:items-center";
/** 리스트형 본문 (`CardContent` 기본 `p-6 pt-0` + 세로 간격) */
export const HOME_CARD_CONTENT = "space-y-3";
/** 가로 스크롤 테이블용: 상·하단 패딩은 기본과 동일, 좌우만 뷰포트에 맞게 조정 */
export const HOME_CARD_CONTENT_TABLE = "overflow-x-auto px-0 sm:px-6";

/** 카드 헤더 버튼 */
export const HOME_CARD_ACTION_BUTTON = "shrink-0 min-w-[88px]";

/** 카드 내부 아이템 박스 */
export const HOME_ITEM_BOX = "rounded-lg border border-border bg-muted/20 px-3 py-2.5";
