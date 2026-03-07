"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { StoreInfo } from "@/apps/web-user/features/store/types/store.type";
import {
  LIST_SHEET_HANDLE_HEIGHT,
  LIST_SHEET_OPEN_RATIO,
  LIST_SHEET_BOTTOM_NAV_HEIGHT,
} from "@/apps/web-user/features/store/constants/map.constant";

/** 스냅 단계: 없음(0) / 중간 / 꽉채우기 */
function getSnapPoints() {
  if (typeof window === "undefined")
    return { closed: 0, middle: 400, full: 600 };
  const middle = Math.round(
    window.innerHeight * LIST_SHEET_OPEN_RATIO - LIST_SHEET_HANDLE_HEIGHT,
  );
  const full = Math.round(
    window.innerHeight - LIST_SHEET_BOTTOM_NAV_HEIGHT - LIST_SHEET_HANDLE_HEIGHT,
  );
  return { closed: 0, middle, full };
}

/** 후보들 중 current와 가장 가까운 스냅 포인트 */
function nearestAmong(current: number, candidates: number[]): number {
  let best = candidates[0] ?? 0;
  let bestDist = Math.abs(current - best);
  for (const p of candidates) {
    const d = Math.abs(current - p);
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  return best;
}

/** 드래그 시작 시 스냅 단계(오프셋 값) + 손 뗐을 때 위치로 스냅할 값 결정 */
function resolveSnap(
  current: number,
  snapAtPointerDown: number,
): number {
  const { closed, middle, full } = getSnapPoints();
  // 꽉채운 상태에서 아래로 조금이라도 내렸으면 → 중간/없음 중 가까운 쪽으로
  if (snapAtPointerDown === full && current < full) {
    return nearestAmong(current, [closed, middle]);
  }
  // 없음 상태에서 위로 조금이라도 올렸으면 → 중간/꽉채움 중 가까운 쪽으로
  if (snapAtPointerDown === closed && current > closed) {
    return nearestAmong(current, [middle, full]);
  }
  // 중간 상태에서 아래로 내렸으면 → 없음, 위로 올렸으면 → 꽉채우기
  if (snapAtPointerDown === middle && current < middle) {
    return closed;
  }
  if (snapAtPointerDown === middle && current > middle) {
    return full;
  }
  return nearestAmong(current, [closed, middle, full]);
}

/**
 * 지도 하단 목록 시트(드래그 패널) 상태 및 제스처 처리
 * 3단계: 없음(0) / 중간(45vh) / 꽉채우기(화면 상단까지)
 * 드래그 후 손을 떼면 가장 가까운 단계로 스냅 (살짝만 움직여도 인접 단계로 이동)
 */
export function useMapListSheet(getStoresForList: () => StoreInfo[]) {
  const [listSheetStores, setListSheetStores] = useState<StoreInfo[]>([]);
  const [listSheetPanelOffset, setListSheetPanelOffset] = useState(0);
  const [isListSheetPanelDragging, setIsListSheetPanelDragging] = useState(false);

  const listSheetDragStartYRef = useRef<number | null>(null);
  const listSheetDragStartOffsetRef = useRef(0);
  /** 드래그 시작 시점의 스냅 단계(0 | middle | full) - 손 뗐을 때 “돌아갈 수 있는” 후보 제한용 */
  const listSheetSnapAtPointerDownRef = useRef(0);
  const listSheetPanelMaxOffsetRef = useRef(400);
  const listSheetPanelOffsetRef = useRef(0);

  /** 꽉채우기 오프셋 (드래그 상한) */
  const getListSheetMaxOffset = useCallback(() => {
    return getSnapPoints().full;
  }, []);

  /** 중간단계 오프셋 (목록 열었을 때 기본 높이) */
  const getListSheetMiddleOffset = useCallback(() => {
    return getSnapPoints().middle;
  }, []);

  const openListSheet = useCallback(() => {
    const stores = getStoresForList();
    setListSheetStores(stores);
    const { middle, full } = getSnapPoints();
    listSheetPanelMaxOffsetRef.current = full;
    listSheetPanelOffsetRef.current = middle;
    setListSheetPanelOffset(middle);
  }, [getStoresForList]);

  const closeListSheet = useCallback(() => {
    listSheetPanelOffsetRef.current = 0;
    setListSheetPanelOffset(0);
  }, []);

  const handlePointerDown = useCallback(
    (clientY: number) => {
      listSheetPanelMaxOffsetRef.current = getListSheetMaxOffset();
      listSheetDragStartYRef.current = clientY;
      listSheetDragStartOffsetRef.current = listSheetPanelOffset;
      listSheetSnapAtPointerDownRef.current = nearestAmong(listSheetPanelOffset, [
        0,
        getListSheetMiddleOffset(),
        getListSheetMaxOffset(),
      ]);
      setIsListSheetPanelDragging(true);
      setListSheetStores(getStoresForList());
    },
    [getListSheetMaxOffset, getListSheetMiddleOffset, listSheetPanelOffset, getStoresForList],
  );

  const handlePointerMove = useCallback((clientY: number) => {
    const startY = listSheetDragStartYRef.current;
    if (startY == null) return;
    const maxOff = listSheetPanelMaxOffsetRef.current;
    const startOff = listSheetDragStartOffsetRef.current;
    const deltaY = startY - clientY;
    const next = Math.max(0, Math.min(maxOff, startOff + deltaY));
    listSheetPanelOffsetRef.current = next;
    setListSheetPanelOffset(next);
  }, []);

  const handlePointerUp = useCallback(() => {
    listSheetDragStartYRef.current = null;
    setIsListSheetPanelDragging(false);
    const current = listSheetPanelOffsetRef.current;
    const snapAtDown = listSheetSnapAtPointerDownRef.current;
    const snapped = resolveSnap(current, snapAtDown);
    listSheetPanelOffsetRef.current = snapped;
    setListSheetPanelOffset(snapped);
  }, []);

  useEffect(() => {
    listSheetPanelOffsetRef.current = listSheetPanelOffset;
  }, [listSheetPanelOffset]);

  return {
    listSheetStores,
    setListSheetStores,
    listSheetPanelOffset,
    setListSheetPanelOffset,
    isListSheetPanelDragging,
    listSheetPanelOffsetRef,
    listSheetPanelMaxOffsetRef,
    getListSheetMaxOffset,
    getListSheetMiddleOffset,
    openListSheet,
    closeListSheet,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    LIST_SHEET_HANDLE_HEIGHT,
  };
}
