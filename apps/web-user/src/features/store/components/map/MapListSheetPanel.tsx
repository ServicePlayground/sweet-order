"use client";

import { ReactNode } from "react";
import { LIST_SHEET_HANDLE_HEIGHT } from "@/apps/web-user/features/store/constants/map.constant";

interface MapListSheetPanelProps {
  /** 패널 오프셋(px). 0이면 핸들만 보임 */
  offset: number;
  isDragging: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  children: ReactNode;
}

export function MapListSheetPanel({
  offset,
  isDragging,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  children,
}: MapListSheetPanelProps) {
  return (
    <div
      className="fixed left-0 right-0 bottom-[60px] z-40 flex flex-col max-w-[638px] mx-auto overflow-hidden"
      style={{
        height: LIST_SHEET_HANDLE_HEIGHT + offset,
        transition: isDragging ? "none" : "height 0.25s ease-out",
        boxShadow: "0px 4px 16px 0px #00000029",
        background: "#FFFFFF",
        borderRadius: "20px 20px 0 0",
      }}
      aria-label="목록 패널"
    >
      <div
        role="presentation"
        className="shrink-0 flex h-8 items-center justify-center cursor-grab active:cursor-grabbing touch-none py-[13px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onMouseDown={onMouseDown}
        style={{ touchAction: "none" }}
      >
        <div
          className="rounded-full bg-gray-200 shrink-0"
          style={{ width: 56, height: 6 }}
          aria-hidden
        />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col">
        {children}
      </div>
    </div>
  );
}
