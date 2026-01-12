import type { CSSProperties } from "react";
import clsx from "clsx";

import Cart from "./icons/cart.svg";
import ChevronLeft from "./icons/chevron-left.svg";

interface IconProps {
  name: keyof typeof iconTypes;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

export const iconTypes = {
  cart: Cart,
  chevronLeft: ChevronLeft,
};

export default function Icon({ name, width, height, className, ...props }: IconProps) {
  const IconComponent = iconTypes[name];
  return (
    <span className={clsx("inline-flex items-center", className)} {...props}>
      <IconComponent width={width} height={height} className="h-auto max-w-full" />
    </span>
  );
}
