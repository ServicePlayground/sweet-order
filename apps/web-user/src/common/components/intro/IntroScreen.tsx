"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Icon } from "@/apps/web-user/common/components/icons";

const VISIBLE_DURATION_MS = 1500;
const FADE_DURATION_MS = 300;

/**
 * 앱 진입 시 한 번 노출되는 전체화면 인트로(스플래시).
 * 일정 시간 후 페이드아웃되며 자동으로 언마운트된다.
 */
export function IntroScreen() {
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setIsExiting(true), VISIBLE_DURATION_MS);
    const unmountTimer = window.setTimeout(
      () => setShouldRender(false),
      VISIBLE_DURATION_MS + FADE_DURATION_MS,
    );
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-300",
        isExiting ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      aria-hidden={isExiting}
    >
      <Icon name="logoPicake" width={100} height={100} className="animate-pop-in" />
    </div>
  );
}
