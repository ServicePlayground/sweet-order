"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const THUMB_WIDTH_PX = 24;

const THUMB_CSS = `
  .dual-thumb-range-slider-thumb::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid var(--grayscale-gr-200, #D4D4D3);
    background: var(--grayscale-gr-00, #FFFFFF);
    box-shadow: 0px 2px 5px 0px #0000000F;
  }
`;

const styles = {
  label:
    "absolute whitespace-nowrap text-[13px] font-bold leading-[140%] text-[var(--grayscale-gr-900,#1A1A1A)] -translate-x-1/2 top-0",
  hint: "mt-2 flex justify-between text-xs font-normal leading-[140%] text-[var(--grayscale-gr-400,#9E9E9D)]",
} as const;

export interface DualThumbRangeSliderProps {
  /** 스케일 최소값 (정수) */
  min: number;
  /** 스케일 최대값 (정수) */
  max: number;
  /** 현재 최소값 */
  valueMin: number;
  /** 현재 최대값 */
  valueMax: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  /** 썸/힌트에 표시할 라벨 포맷 */
  formatLabel: (value: number) => string;
  /** 그룹 aria-label */
  ariaLabel?: string;
  /** 최소 썸 aria-label */
  ariaLabelMin?: string;
  /** 최대 썸 aria-label */
  ariaLabelMax?: string;
  className?: string;
}

export function DualThumbRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onMinChange,
  onMaxChange,
  formatLabel,
  ariaLabel = "범위 선택",
  ariaLabelMin = "최소값",
  ariaLabelMax = "최대값",
  className = "",
}: DualThumbRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const activeThumbRef = useRef<"min" | "max" | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTrackWidth(el.offsetWidth));
    ro.observe(el);
    setTrackWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const thumbLeftPercent = useCallback(
    (value: number): number => {
      if (trackWidth <= 0) {
        return ((value - min) / (max - min)) * 100;
      }
      const range = max - min;
      const fraction = (value - min) / range;
      const centerPx = THUMB_WIDTH_PX / 2 + fraction * (trackWidth - THUMB_WIDTH_PX);
      return (centerPx / trackWidth) * 100;
    },
    [trackWidth, min, max],
  );

  const clientXToValue = useCallback(
    (clientX: number): number => {
      const el = trackRef.current;
      if (!el) return min;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const fraction = Math.max(0, Math.min(1, x / rect.width));
      const value = Math.round(min + fraction * (max - min));
      return Math.max(min, Math.min(max, value));
    },
    [min, max],
  );

  const getThumbAt = useCallback(
    (clientX: number): "min" | "max" => {
      const el = trackRef.current;
      if (!el) return "min";
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const minCenterPx = (thumbLeftPercent(valueMin) / 100) * rect.width;
      const maxCenterPx = (thumbLeftPercent(valueMax) / 100) * rect.width;
      return x < (minCenterPx + maxCenterPx) / 2 ? "min" : "max";
    },
    [valueMin, valueMax, thumbLeftPercent],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const thumb = getThumbAt(e.clientX);
      activeThumbRef.current = thumb;
      const value = clientXToValue(e.clientX);
      if (thumb === "min") {
        onMinChange(Math.min(value, valueMax));
      } else {
        onMaxChange(Math.max(value, valueMin));
      }
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [valueMin, valueMax, getThumbAt, clientXToValue, onMinChange, onMaxChange],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (activeThumbRef.current === null) return;
      const value = clientXToValue(e.clientX);
      if (activeThumbRef.current === "min") {
        onMinChange(Math.max(min, Math.min(value, valueMax)));
      } else {
        onMaxChange(Math.max(valueMin, Math.min(value, max)));
      }
    },
    [min, max, valueMin, valueMax, clientXToValue, onMinChange, onMaxChange],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    activeThumbRef.current = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  const fillLeft = ((valueMin - min) / (max - min)) * 100;
  const fillWidth = ((valueMax - valueMin) / (max - min)) * 100;

  return (
    <div className={`mx-auto w-full max-w-[99%] ${className}`.trim()}>
      <div className="relative w-full pt-7">
        <span className={styles.label} style={{ left: `${thumbLeftPercent(valueMin)}%` }}>
          {formatLabel(valueMin)}
        </span>
        <span className={styles.label} style={{ left: `${thumbLeftPercent(valueMax)}%` }}>
          {formatLabel(valueMax)}
        </span>
        <div
          ref={trackRef}
          className="relative h-6 w-full"
          role="group"
          aria-label={ariaLabel}
        >
          <div
            className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--grayscale-gr-50,#F5F5F5)]"
            aria-hidden
          />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--primary-or-400,#FF653E)]"
            style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
            aria-hidden
          />
          <input
            type="range"
            min={min}
            max={max}
            value={valueMin}
            onChange={(e) => {
              const v = Number(e.target.value);
              onMinChange(v);
              if (v > valueMax) onMaxChange(v);
            }}
            className="dual-thumb-range-slider-thumb absolute left-0 top-0 z-[1] h-6 w-full cursor-pointer appearance-none bg-transparent pointer-events-none"
            aria-label={ariaLabelMin}
            tabIndex={-1}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={valueMax}
            onChange={(e) => {
              const v = Number(e.target.value);
              onMaxChange(v);
              if (v < valueMin) onMinChange(v);
            }}
            className="dual-thumb-range-slider-thumb absolute left-0 top-0 z-[2] h-6 w-full cursor-pointer appearance-none bg-transparent pointer-events-none"
            aria-label={ariaLabelMax}
            tabIndex={-1}
          />
          <div
            className="absolute inset-0 z-[3] cursor-pointer"
            aria-hidden
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>
      </div>
      <div className={styles.hint}>
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>
      <style dangerouslySetInnerHTML={{ __html: THUMB_CSS }} />
    </div>
  );
}
