"use client";

import { useEffect, useState } from "react";
import { Icon, iconTypes } from "@/apps/web-user/common/components/icons";

interface ToastProps {
  message: string;
  iconName?: keyof typeof iconTypes;
  iconClassName?: string;
  variant?: "row" | "column";
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  iconName,
  iconClassName,
  variant = "row",
  duration = 2000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 마운트 직후 fade-in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // duration 후 fade-out → unmount
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-[100px] left-1/2 -translate-x-1/2 w-max max-w-[calc(100%-40px)] z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {variant === "row" ? (
        <div className="flex items-center gap-[6px] px-[18px] py-4 bg-gray-900/80 backdrop-blur-sm rounded-xl">
          {iconName && <Icon name={iconName} width={20} height={20} className={`shrink-0 ${iconClassName}`} />}
          <span className="text-sm text-white font-bold min-w-0 break-words">{message}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 px-[46px] py-[36px] bg-gray-900/80 backdrop-blur-sm rounded-xl">
          {iconName && <Icon name={iconName} width={40} height={40} className={iconClassName} />}
          <span className="text-sm text-white font-bold min-w-0 break-words">{message}</span>
        </div>
      )}
    </div>
  );
}
