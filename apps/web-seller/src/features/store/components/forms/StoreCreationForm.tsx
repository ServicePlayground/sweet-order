import React, { useState, useEffect } from "react";
import { IStoreForm } from "@/apps/web-seller/features/store/types/store.type";
import { STORE_ERROR_MESSAGES } from "@/apps/web-seller/features/store/constants/store.constant";
import { ImageUpload } from "@/apps/web-seller/common/components/images/ImageUpload";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";
import { Input } from "@/apps/web-seller/common/components/@shadcn-ui/input";
import { Label } from "@/apps/web-seller/common/components/@shadcn-ui/label";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
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
        </div>
        <div>
          <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
            스토어 이름
          </Label>
          <Input
            placeholder="스위트오더 스토어"
            value={form.name}
            onChange={handleChange("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label>스토어 설명</Label>
          <textarea
            placeholder="맛있는 케이크를 판매하는 스토어입니다."
            rows={4}
            value={form.description || ""}
            onChange={handleChange("description")}
            className={`flex min-h-[80px] w-full rounded-md border ${
              errors.description ? "border-destructive" : "border-input"
            } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        {onPrevious && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            이전
          </Button>
        )}
        <Button type="submit" className={onPrevious ? "ml-auto" : ""}>
          스토어 생성
        </Button>
      </div>
    </form>
  );
};
