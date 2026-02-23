import React, { useState, useEffect } from "react";
import type { StoreForm } from "@/apps/web-seller/features/store/types/store.ui";
import {
  validateStoreName,
  validateStoreDescription,
  validateDetailAddress,
} from "@/apps/web-seller/features/store/utils/validator.util";
import { ImageMultiUpload } from "@/apps/web-seller/features/upload/components/ImageMultiUpload";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { BaseInput as Input } from "@/apps/web-seller/common/components/inputs/BaseInput";
import { Label } from "@/apps/web-seller/common/components/labels/Label";
import { AddressInput } from "@/apps/web-seller/common/components/inputs/AddressInput";

interface Props {
  onSubmit: (data: StoreForm) => void;
  onPrevious?: () => void;
  initialValue?: StoreForm;
  onChange?: (data: StoreForm) => void;
  submitButtonText?: string;
}

export const defaultForm: StoreForm = {
  name: "",
  description: "",
  logoImageUrl: "",
  address: "",
  roadAddress: "",
  detailAddress: "",
  zonecode: "",
  latitude: 0,
  longitude: 0,
};

export const StoreCreationForm: React.FC<Props> = ({
  onSubmit,
  onPrevious,
  initialValue,
  onChange,
  submitButtonText,
}) => {
  const [form, setForm] = useState<StoreForm>(initialValue || defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof StoreForm, string>>>({});

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
      setErrors({});
    }
  }, [initialValue]);

  const validate = () => {
    const newErrors: Partial<Record<keyof StoreForm, string>> = {};

    // 스토어 이름 검증
    const nameError = validateStoreName(form.name);
    if (nameError) {
      newErrors.name = nameError;
    }
    // 스토어 설명 검증
    const descriptionError = validateStoreDescription(form.description);
    if (descriptionError) {
      newErrors.description = descriptionError;
    }
    // 상세주소 검증
    const detailAddressError = validateDetailAddress(form.detailAddress);
    if (detailAddressError) {
      newErrors.detailAddress = detailAddressError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (key: keyof StoreForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <Label>로고 이미지</Label>
          <ImageMultiUpload
            width={300}
            height={300}
            value={form.logoImageUrl ? [form.logoImageUrl] : []}
            onChange={(urls) => {
              const next = { ...form, logoImageUrl: urls[0] || "" };
              setForm(next);
              onChange?.(next);
            }}
            maxImages={1}
            enableDragDrop={true}
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
        <div>
          <AddressInput
            value={{
              address: form.address,
              roadAddress: form.roadAddress,
              zonecode: form.zonecode,
              latitude: form.latitude,
              longitude: form.longitude,
            }}
            onChange={(addressData) => {
              const next = {
                ...form,
                address: addressData.address,
                roadAddress: addressData.roadAddress,
                zonecode: addressData.zonecode,
                latitude: addressData.latitude,
                longitude: addressData.longitude,
              };
              setForm(next);
              onChange?.(next);
            }}
            error={errors.address}
          />
        </div>
        <div>
          <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
            상세주소
          </Label>
          <Input
            placeholder="상세주소를 입력해주세요"
            value={form.detailAddress}
            onChange={handleChange("detailAddress")}
            className={errors.detailAddress ? "border-destructive" : ""}
          />
          {errors.detailAddress && (
            <p className="text-sm text-destructive mt-1">{errors.detailAddress}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        {onPrevious && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            이전
          </Button>
        )}
        <Button type="submit">
          {submitButtonText || (initialValue ? "수정하기" : "등록하기")}
        </Button>
      </div>
    </form>
  );
};
