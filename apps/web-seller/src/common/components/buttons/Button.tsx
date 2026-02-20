import React from "react";
import {
  BaseButton,
  BaseButtonProps,
} from "@/apps/web-seller/common/components/buttons/BaseButton";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

interface ButtonProps extends BaseButtonProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <BaseButton ref={ref} className={cn("font-semibold", className)} {...props}>
        {children}
      </BaseButton>
    );
  },
);
Button.displayName = "Button";
