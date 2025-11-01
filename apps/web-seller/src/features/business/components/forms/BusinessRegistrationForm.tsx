import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { IBusinessRegistrationForm } from "@/apps/web-seller/features/business/types/business.type";
import {
  isValidBusinessNo,
  isValidStartDateYmd,
} from "@/apps/web-seller/common/utils/validator.util";
import { BUSINESS_ERROR_MESSAGES } from "@/apps/web-seller/features/business/constants/business.constant";

interface Props {
  onSubmit: (data: IBusinessRegistrationForm) => void;
  initialValue?: IBusinessRegistrationForm;
}

export const defaultForm: IBusinessRegistrationForm = {
  b_no: "",
  p_nm: "",
  start_dt: "",
  b_nm: "",
  b_sector: "",
  b_type: "",
};

export const BusinessRegistrationForm: React.FC<Props> = ({ onSubmit, initialValue }) => {
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
      setForm({ ...form, [key]: value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <TextField
            label="사업자등록번호(1234567890)"
            fullWidth
            value={form.b_no}
            onChange={handleChange("b_no")}
            error={Boolean(errors.b_no)}
            helperText={errors.b_no}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 10 }}
            required
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="대표자명(홍길동)"
            fullWidth
            value={form.p_nm}
            onChange={handleChange("p_nm")}
            error={Boolean(errors.p_nm)}
            helperText={errors.p_nm}
            required
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="개업일(20251030)"
            fullWidth
            value={form.start_dt}
            onChange={handleChange("start_dt")}
            error={Boolean(errors.start_dt)}
            helperText={errors.start_dt}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 8 }}
            required
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="상호(스위트오더)"
            fullWidth
            value={form.b_nm}
            onChange={handleChange("b_nm")}
            error={Boolean(errors.b_nm)}
            helperText={errors.b_nm}
            required
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="업태(도매 및 소매업)"
            fullWidth
            value={form.b_sector}
            onChange={handleChange("b_sector")}
            error={Boolean(errors.b_sector)}
            helperText={errors.b_sector}
            required
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="종목(전자상거래 소매 중개업)"
            fullWidth
            value={form.b_type}
            onChange={handleChange("b_type")}
            error={Boolean(errors.b_type)}
            helperText={errors.b_type}
            required
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained">
          다음 단계
        </Button>
      </Box>
    </Box>
  );
};
