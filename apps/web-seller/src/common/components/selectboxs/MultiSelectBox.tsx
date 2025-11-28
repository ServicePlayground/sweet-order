import React, { useState } from "react";
import { Label } from "@/apps/web-seller/common/components/ui/label";
import { Badge } from "@/apps/web-seller/common/components/ui/badge";
import { Button } from "@/apps/web-seller/common/components/ui/button";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/apps/web-seller/common/lib/utils";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface MultiSelectBoxProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly SelectOption[];
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const MultiSelectBox: React.FC<MultiSelectBoxProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  fullWidth = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <Label className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
        {label}
      </Label>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between h-auto min-h-9",
            error ? "border-destructive" : ""
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{label}</span>
            ) : (
              value.map((val) => {
                const option = options.find((opt) => opt.value === val);
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="mr-1"
                  >
                    {option?.label || val}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(val);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
            <div className="p-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm",
                    value.includes(option.value) && "bg-accent"
                  )}
                  onClick={() => toggleOption(option.value)}
                >
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                    {value.includes(option.value) && <Check className="h-4 w-4" />}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};
