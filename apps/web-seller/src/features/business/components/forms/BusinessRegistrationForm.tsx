import React, { useState, useEffect } from "react";
import { IBusinessRegistrationForm } from "@/apps/web-seller/features/business/types/business.type";
import {
  isValidBusinessNo,
  isValidStartDateYmd,
} from "@/apps/web-seller/common/utils/validator.util";
import { BUSINESS_ERROR_MESSAGES } from "@/apps/web-seller/features/business/constants/business.constant";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";
import { Input } from "@/apps/web-seller/common/components/@shadcn-ui/input";
import { Label } from "@/apps/web-seller/common/components/@shadcn-ui/label";

interface Props {
  onSubmit: (data: IBusinessRegistrationForm) => void;
  initialValue?: IBusinessRegistrationForm;
  onChange?: (data: IBusinessRegistrationForm) => void;
}

export const defaultForm: IBusinessRegistrationForm = {
  b_no: "",
  p_nm: "",
  start_dt: "",
  b_nm: "",
  b_sector: "",
  b_type: "",
};

export const BusinessRegistrationForm: React.FC<Props> = ({ onSubmit, initialValue, onChange }) => {
  const [form, setForm] = useState<IBusinessRegistrationForm>(initialValue || defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof IBusinessRegistrationForm, string>>>(
    {},
  );

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
      setErrors({});
    }
  }, [initialValue]);

  const validate = () => {
    const newErrors: Partial<Record<keyof IBusinessRegistrationForm, string>> = {};

    if (!isValidBusinessNo(form.b_no))
      newErrors.b_no = BUSINESS_ERROR_MESSAGES.BUSINESS_REGISTRATION_NUMBER_INVALID_FORMAT;
    if (!form.p_nm.trim()) newErrors.p_nm = BUSINESS_ERROR_MESSAGES.REPRESENTATIVE_NAME_REQUIRED;
    if (!isValidStartDateYmd(form.start_dt))
      newErrors.start_dt = BUSINESS_ERROR_MESSAGES.OPENING_DATE_INVALID_FORMAT;
    if (!form.b_nm.trim()) newErrors.b_nm = BUSINESS_ERROR_MESSAGES.BUSINESS_NAME_REQUIRED;
    if (!form.b_sector.trim())
      newErrors.b_sector = BUSINESS_ERROR_MESSAGES.BUSINESS_SECTOR_REQUIRED;
    if (!form.b_type.trim()) newErrors.b_type = BUSINESS_ERROR_MESSAGES.BUSINESS_TYPE_REQUIRED;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (key: keyof IBusinessRegistrationForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // 숫자만 허용해야 하는 필드들: b_no(10자리), start_dt(YYYYMMDD)
      const value = key === "b_no" || key === "start_dt" ? raw.replace(/\D/g, "") : raw;
      const next = { ...form, [key]: value };
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
            사업자등록번호
          </Label>
          <Input
            placeholder="1234567890"
            value={form.b_no}
            onChange={handleChange("b_no")}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            className={errors.b_no ? "border-destructive" : ""}
          />
          {errors.b_no && <p className="text-sm text-destructive mt-1">{errors.b_no}</p>}
        </div>
        <div>
          <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
            대표자명
          </Label>
          <Input
            placeholder="홍길동"
            value={form.p_nm}
            onChange={handleChange("p_nm")}
            className={errors.p_nm ? "border-destructive" : ""}
          />
          {errors.p_nm && <p className="text-sm text-destructive mt-1">{errors.p_nm}</p>}
        </div>
        <div>
          <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">개업일</Label>
          <Input
            placeholder="20251030"
            value={form.start_dt}
            onChange={handleChange("start_dt")}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={8}
            className={errors.start_dt ? "border-destructive" : ""}
          />
          {errors.start_dt && <p className="text-sm text-destructive mt-1">{errors.start_dt}</p>}
        </div>
        <div>
          <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">상호</Label>
          <Input
            placeholder="스위트오더"
            value={form.b_nm}
            onChange={handleChange("b_nm")}
            className={errors.b_nm ? "border-destructive" : ""}
          />
          {errors.b_nm && <p className="text-sm text-destructive mt-1">{errors.b_nm}</p>}
        </div>
        <div>
          <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">업태</Label>
          <Input
            placeholder="도매 및 소매업"
            value={form.b_sector}
            onChange={handleChange("b_sector")}
            className={errors.b_sector ? "border-destructive" : ""}
          />
          {errors.b_sector && <p className="text-sm text-destructive mt-1">{errors.b_sector}</p>}
        </div>
        <div>
          <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">종목</Label>
          <Input
            placeholder="전자상거래 소매 중개업"
            value={form.b_type}
            onChange={handleChange("b_type")}
            className={errors.b_type ? "border-destructive" : ""}
          />
          {errors.b_type && <p className="text-sm text-destructive mt-1">{errors.b_type}</p>}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit">다음 단계</Button>
      </div>
    </form>
  );
};
