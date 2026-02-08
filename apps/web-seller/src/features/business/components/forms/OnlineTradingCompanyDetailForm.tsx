import React, { useState, useEffect } from "react";
import { IOnlineTradingCompanyDetailForm } from "@/apps/web-seller/features/business/types/business.type";
import { isValidPermissionManagementNumber } from "@/apps/web-seller/common/utils/validator.util";
import { BUSINESS_ERROR_MESSAGES } from "@/apps/web-seller/features/business/constants/business.constant";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";
import { Input } from "@/apps/web-seller/common/components/@shadcn-ui/input";
import { Label } from "@/apps/web-seller/common/components/@shadcn-ui/label";

interface Props {
  onSubmit: (data: IOnlineTradingCompanyDetailForm) => void;
  onPrevious?: () => void;
  initialValue?: IOnlineTradingCompanyDetailForm;
  onChange?: (data: IOnlineTradingCompanyDetailForm) => void;
}

export const defaultForm: IOnlineTradingCompanyDetailForm = {
  prmmiMnno: "",
};

export const OnlineTradingCompanyDetailForm: React.FC<Props> = ({
  onSubmit,
  onPrevious,
  initialValue,
  onChange,
}) => {
  const [form, setForm] = useState<IOnlineTradingCompanyDetailForm>(initialValue || defaultForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof IOnlineTradingCompanyDetailForm, string>>
  >({});

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
      setErrors({});
    }
  }, [initialValue]);

  const validate = () => {
    const newErrors: Partial<Record<keyof IOnlineTradingCompanyDetailForm, string>> = {};

    if (!isValidPermissionManagementNumber(form.prmmiMnno))
      newErrors.prmmiMnno = BUSINESS_ERROR_MESSAGES.PERMISSION_MANAGEMENT_NUMBER_INVALID_FORMAT;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (key: keyof IOnlineTradingCompanyDetailForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
