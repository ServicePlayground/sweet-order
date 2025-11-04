import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { IStoreForm } from "@/apps/web-seller/features/store/types/store.type";
import { STORE_ERROR_MESSAGES } from "@/apps/web-seller/features/store/constants/store.constant";
import { ImageUpload } from "@/apps/web-seller/common/components/images/ImageUpload";

interface Props {
  onSubmit: (data: IStoreForm) => void;
  onPrevious?: () => void;
  initialValue?: IStoreForm;
  onChange?: (data: IStoreForm) => void;
}

export const defaultForm: IStoreForm = {
  name: "",
  description: "",
  logoImageUrl: "",
};

export const StoreCreationForm: React.FC<Props> = ({
  onSubmit,
  onPrevious,
  initialValue,
  onChange,
}) => {
  const [form, setForm] = useState<IStoreForm>(initialValue || defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof IStoreForm, string>>>({});

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
      setErrors({});
    }
  }, [initialValue]);

  const validate = () => {
    const newErrors: Partial<Record<keyof IStoreForm, string>> = {};

    if (!form.name.trim()) {
      newErrors.name = STORE_ERROR_MESSAGES.NAME_REQUIRED;
    } else if (form.name.length > 100) {
      newErrors.name = STORE_ERROR_MESSAGES.NAME_TOO_LONG;
    }

    if (form.description && form.description.length > 500) {
      newErrors.description = STORE_ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (key: keyof IStoreForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <ImageUpload
            width={360}
            height={360}
            label="로고 이미지"
            value={form.logoImageUrl || ""}
            onChange={(url) => {
              const next = { ...form, logoImageUrl: url };
              setForm(next);
              onChange?.(next);
            }}
            error={errors.logoImageUrl}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="스토어 이름(스위트오더 스토어)"
            fullWidth
            value={form.name}
            onChange={handleChange("name")}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="스토어 설명(맛있는 케이크를 판매하는 스토어입니다.)"
            fullWidth
            multiline
            rows={4}
            value={form.description || ""}
            onChange={handleChange("description")}
            error={Boolean(errors.description)}
            helperText={errors.description}
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
          스토어 생성
        </Button>
      </Box>
    </Box>
  );
};
