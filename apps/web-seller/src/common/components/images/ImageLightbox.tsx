import React, { useEffect } from "react";

export interface ImageLightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

/** 이미지 확대 보기 라이트박스 (클릭 시 닫기) */
export const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, alt = "이미지", onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 확대 보기"
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
