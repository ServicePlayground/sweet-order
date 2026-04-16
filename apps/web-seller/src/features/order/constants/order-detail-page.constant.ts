/**
 * 주문 상세 화면 UI 클래스 토큰 (시트·표·헤더·버튼).
 * @see features/home/constants/store-home-typography.constant.ts — 동일한 상수 패턴
 */

export const ORDER_DETAIL_SHEET =
  "overflow-hidden rounded-lg border border-slate-300/90 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]";

export const ORDER_DETAIL_SHEET_HEADER =
  "border-b border-slate-300 bg-gradient-to-b from-[#f6f7fa] to-[#eceef3] px-4 py-3";

/** 시트 내부 소제목 (주문 데이터, 주문 처리 등) */
export const ORDER_DETAIL_SHEET_TITLE = "text-sm font-semibold text-slate-800";

/** 페이지 최상단 제목 */
export const ORDER_DETAIL_PAGE_TITLE = "text-xl font-semibold tracking-tight text-slate-900";

/** 페이지 부가 정보 (주문번호 등) */
export const ORDER_DETAIL_PAGE_META = "mt-1 text-[13px] text-slate-600";

export const ORDER_DETAIL_TABLE = "w-full border-collapse text-left text-[13px] leading-snug";

export const ORDER_DETAIL_TH_SECTION =
  "border border-slate-300 bg-[#e7e9ee] px-3 py-2 text-left text-sm font-semibold tracking-wide text-slate-800";

/** 시트 내부 상단 띠(진행 단계 등) — 좌우는 시트 테두리에 맞춤 */
export const ORDER_DETAIL_INNER_SECTION_HEAD =
  "border-b border-slate-300 bg-[#e7e9ee] px-3 py-2 text-left text-sm font-semibold tracking-wide text-slate-800";

export const ORDER_DETAIL_TH_COL =
  "border border-slate-300 bg-[#f1f3f7] px-2.5 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600";

export const ORDER_DETAIL_TD_LABEL =
  "w-[min(32%,220px)] whitespace-nowrap border border-slate-300 bg-slate-50/90 px-3 py-2 text-[13px] font-medium text-slate-600";

export const ORDER_DETAIL_TD_VALUE =
  "border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900";

/** 표 하단 병합 셀(작업 버튼·사유 입력 등) */
export const ORDER_DETAIL_TD_BLOCK =
  "border border-slate-300 bg-white px-3 py-3 align-top text-[13px] text-slate-900";

export const ORDER_DETAIL_TD_CELL =
  "border border-slate-300 bg-white px-2.5 py-2 align-top text-[13px] text-slate-900";

export const ORDER_DETAIL_MONO = "font-mono text-[12.5px] tabular-nums text-slate-800";

export const ORDER_DETAIL_MUTED = "text-slate-500";

/** 주문 처리 작업 버튼 — 시트 본문과 동일 계층의 크기 */
export const ORDER_DETAIL_ACTION_BTN =
  "h-9 min-h-9 flex-1 basis-0 min-w-0 whitespace-normal rounded-md px-4 py-2 text-center text-[13px] font-medium leading-snug";

/** 본문 강조 문단 (상태 안내 등) */
export const ORDER_DETAIL_BODY = "text-[13px] leading-snug text-slate-700";
