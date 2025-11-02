import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { IOnlineTradingCompanyDetailForm } from "@/apps/web-seller/features/business/types/business.type";
import { isValidPermissionManagementNumber } from "@/apps/web-seller/common/utils/validator.util";
import { BUSINESS_ERROR_MESSAGES } from "@/apps/web-seller/features/business/constants/business.constant";

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
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <TextField
            label="인허가관리번호(통신번호)"
            fullWidth
            value={form.prmmiMnno}
            onChange={handleChange("prmmiMnno")}
            error={Boolean(errors.prmmiMnno)}
            helperText={errors.prmmiMnno}
            placeholder="2021-서울강동-0422"
            required
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
        {onPrevious && (
          <Button type="button" variant="outlined" onClick={onPrevious}>
            이전
          </Button>
        )}
        <Button type="submit" variant="contained" sx={{ ml: onPrevious ? "auto" : 0 }}>
          다음 단계
        </Button>
      </Box>
    </Box>
  );
};
