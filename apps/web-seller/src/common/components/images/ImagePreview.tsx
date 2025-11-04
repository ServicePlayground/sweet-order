import React from "react";

type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export interface ImagePreviewProps {
  src: string;
  alt?: string;
  objectFit?: ObjectFit;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = "미리보기",
  objectFit = "cover",
}) => {
  return <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit }} />;
};
