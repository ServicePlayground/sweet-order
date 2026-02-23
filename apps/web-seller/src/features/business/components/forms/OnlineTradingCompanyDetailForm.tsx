import React, { useState, useEffect } from "react";
import type { OnlineTradingCompanyDetailFormValues } from "@/apps/web-seller/features/business/types/business.ui";
import { validatePermissionManagementNumber } from "@/apps/web-seller/features/business/utils/validator.util";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { BaseInput as Input } from "@/apps/web-seller/common/components/inputs/BaseInput";
import { Label } from "@/apps/web-seller/common/components/labels/Label";

interface Props {
  onSubmit: (data: OnlineTradingCompanyDetailFormValues) => void;
  onPrevious?: () => void;
  initialValue?: OnlineTradingCompanyDetailFormValues;
  onChange?: (data: OnlineTradingCompanyDetailFormValues) => void;
}

export const defaultForm: OnlineTradingCompanyDetailFormValues = {
  prmmiMnno: "", // 인허가관리번호
};

export const OnlineTradingCompanyDetailForm: React.FC<Props> = ({
  onSubmit,
  onPrevious,
  initialValue,
  onChange,
}) => {
  const [form, setForm] = useState<OnlineTradingCompanyDetailFormValues>(
    initialValue || defaultForm,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof OnlineTradingCompanyDetailFormValues, string>>
  >({});

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
      setErrors({});
    }
  }, [initialValue]);

  const validate = () => {
    const newErrors: Partial<Record<keyof OnlineTradingCompanyDetailFormValues, string>> = {};

    const permissionManagementNumberError = validatePermissionManagementNumber(form.prmmiMnno);
    if (permissionManagementNumberError) {
      newErrors.prmmiMnno = permissionManagementNumberError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (key: keyof OnlineTradingCompanyDetailFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = { ...form, [key]: e.target.value };
      setForm(next);
      onChange?.(next);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
            인허가관리번호
          </Label>
          <Input
            placeholder="2021-서울강동-0422"
            value={form.prmmiMnno}
            onChange={handleChange("prmmiMnno")}
            className={errors.prmmiMnno ? "border-destructive" : ""}
          />
          {errors.prmmiMnno && <p className="text-sm text-destructive mt-1">{errors.prmmiMnno}</p>}
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        {onPrevious && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            이전
          </Button>
        )}
        <Button type="submit">다음 단계</Button>
      </div>
    </form>
  );
};
