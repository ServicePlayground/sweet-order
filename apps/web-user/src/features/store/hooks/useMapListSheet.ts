"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { StoreInfo } from "@/apps/web-user/features/store/types/store.type";
import {
  LIST_SHEET_HANDLE_HEIGHT,
  LIST_SHEET_OPEN_RATIO,
  LIST_SHEET_SNAP_THRESHOLD,
} from "@/apps/web-user/features/store/constants/map.constant";

/**
 * 지도 하단 목록 시트(드래그 패널) 상태 및 제스처 처리
 * @param getStoresForList - 목록에 쓸 스토어 배열 (열기/드래그 시작 시 호출)
 */
export function useMapListSheet(getStoresForList: () => StoreInfo[]) {
  const [listSheetStores, setListSheetStores] = useState<StoreInfo[]>([]);
  const [listSheetPanelOffset, setListSheetPanelOffset] = useState(0);
  const [isListSheetPanelDragging, setIsListSheetPanelDragging] = useState(false);

  const listSheetDragStartYRef = useRef<number | null>(null);
  const listSheetDragStartOffsetRef = useRef(0);
  const listSheetPanelMaxOffsetRef = useRef(400);
  const listSheetPanelOffsetRef = useRef(0);

  const getListSheetMaxOffset = useCallback(() => {
    if (typeof window === "undefined") return 400;
    return Math.round(window.innerHeight * LIST_SHEET_OPEN_RATIO - LIST_SHEET_HANDLE_HEIGHT);
  }, []);

  const openListSheet = useCallback(() => {
    const stores = getStoresForList();
    setListSheetStores(stores);
    const maxOff = getListSheetMaxOffset();
    listSheetPanelMaxOffsetRef.current = maxOff;
    listSheetPanelOffsetRef.current = maxOff;
    setListSheetPanelOffset(maxOff);
  }, [getStoresForList, getListSheetMaxOffset]);

  const closeListSheet = useCallback(() => {
    listSheetPanelOffsetRef.current = 0;
    setListSheetPanelOffset(0);
  }, []);

  const handlePointerDown = useCallback(
    (clientY: number) => {
      listSheetPanelMaxOffsetRef.current = getListSheetMaxOffset();
      listSheetDragStartYRef.current = clientY;
      listSheetDragStartOffsetRef.current = listSheetPanelOffset;
      setIsListSheetPanelDragging(true);
      setListSheetStores(getStoresForList());
    },
    [getListSheetMaxOffset, listSheetPanelOffset, getStoresForList],
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
    const maxOff = listSheetPanelMaxOffsetRef.current;
    const current = listSheetPanelOffsetRef.current;
    if (current >= LIST_SHEET_SNAP_THRESHOLD) {
      setListSheetPanelOffset(maxOff);
      listSheetPanelOffsetRef.current = maxOff;
    } else {
      setListSheetPanelOffset(0);
      listSheetPanelOffsetRef.current = 0;
    }
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
    openListSheet,
    closeListSheet,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    LIST_SHEET_HANDLE_HEIGHT,
  };
}
