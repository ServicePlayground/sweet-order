import React from "react";
import {
  IProductForm,
  EnableStatus,
  OptionRequired,
} from "@/apps/web-seller/features/product/types/product.type";
import {
  OPTION_REQUIRED_OPTIONS,
  ENABLE_DISABLE_OPTIONS,
} from "@/apps/web-seller/features/product/constants/product.constant";
import { SelectBox } from "@/apps/web-seller/common/components/selects/SelectBox";
import { BaseInput as Input } from "@/apps/web-seller/common/components/inputs/BaseInput";
import { Label } from "@/apps/web-seller/common/components/labels/Label";
import { Card, CardContent } from "@/apps/web-seller/common/components/cards/Card";

export interface ProductCreationLetteringPolicySectionProps {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onLetteringVisibleChange: (value: EnableStatus) => void;
  onLetteringRequiredChange: (value: OptionRequired) => void;
  onLetteringMaxLengthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUploadEnabledChange: (value: EnableStatus) => void;
}

// 상품 등록 폼 - 레터링 정책 섹션
export const ProductCreationLetteringPolicySection: React.FC<
  ProductCreationLetteringPolicySectionProps
> = ({
  form,
  errors,
  onLetteringVisibleChange,
  onLetteringRequiredChange,
  onLetteringMaxLengthChange,
  onImageUploadEnabledChange,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-2">레터링 정책</h2>
        <div className="border-t mb-6" />

        <div className="grid grid-cols-1 gap-6">
          <div>
            <SelectBox
              label="레터링 문구 사용 여부"
              value={form.letteringVisible}
              onChange={(value) => onLetteringVisibleChange(value as EnableStatus)}
              options={ENABLE_DISABLE_OPTIONS}
              error={errors.letteringVisible}
              required
            />
          </div>

          <div>
            <SelectBox
              label="레터링 문구 필수 여부"
              value={form.letteringRequired}
              onChange={(value) => onLetteringRequiredChange(value as OptionRequired)}
              options={OPTION_REQUIRED_OPTIONS}
              error={errors.letteringRequired}
              required
            />
          </div>

          <div>
            <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
              최대 글자 수
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder=""
              value={form.letteringMaxLength === 0 ? "" : form.letteringMaxLength.toString()}
              onChange={onLetteringMaxLengthChange}
              className={errors.letteringMaxLength ? "border-destructive" : ""}
            />
            {errors.letteringMaxLength && (
              <p className="text-sm text-destructive mt-1">{errors.letteringMaxLength}</p>
            )}
          </div>

          <div>
            <SelectBox
              label="이미지 등록"
              value={form.imageUploadEnabled}
              onChange={(value) => onImageUploadEnabledChange(value as EnableStatus)}
              options={ENABLE_DISABLE_OPTIONS}
              error={errors.imageUploadEnabled}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
