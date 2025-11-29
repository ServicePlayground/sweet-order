import React from "react";
import { cn } from "@/apps/web-seller/common/lib/utils";

interface Props {
  activeStep: number; // 0-based index
  steps: Array<React.ReactNode>;
  title?: React.ReactNode;
  alternativeLabel?: boolean;
  containerSx?: any;
  stepperProps?: any;
}

export const ProgressBar: React.FC<Props> = ({
  activeStep,
  steps,
  title = "",
}) => {
  return (
    <div className="mb-6">
      {title && (
        <h2 className="text-xl font-semibold mb-2">
          {title}
        </h2>
      )}
      <div className="flex items-center justify-between">
        {steps.map((label, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;

          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2",
                    isCompleted && "bg-primary text-primary-foreground",
                    isActive && "bg-primary text-primary-foreground border-2 border-primary",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <div
                  className={cn(
                    "text-sm text-center",
                    (isActive || isCompleted) && "font-medium text-foreground",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {label}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-muted mx-2 relative top-[-24px]">
                  <div
                    className={cn(
                      "h-full transition-all",
                      isCompleted ? "bg-primary w-full" : "bg-muted w-0"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
