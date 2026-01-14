import React from "react";
import { IProductForm, EnableStatus } from "@/apps/web-seller/features/product/types/product.type";
import {
  SALES_STATUS_OPTIONS,
  VISIBILITY_STATUS_OPTIONS,
} from "@/apps/web-seller/features/product/constants/product.constant";
import { MultipleImageUpload } from "@/apps/web-seller/common/components/images/MultipleImageUpload";
import { SelectBox } from "@/apps/web-seller/common/components/selectboxs/SelectBox";
import { Input } from "@/apps/web-seller/common/components/@shadcn-ui/input";
import { Label } from "@/apps/web-seller/common/components/@shadcn-ui/label";

export interface ProductCreationBasicInfoSectionProps {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onSalesStatusChange: (value: EnableStatus) => void;
  onVisibilityStatusChange: (value: EnableStatus) => void;
  onMainImageChange: (url: string) => void;
  onAdditionalImagesChange: (urls: string[]) => void;
  onChange: (
    key: keyof IProductForm,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// 상품 등록 폼 - 기본 정보 섹션
export const ProductCreationBasicInfoSection: React.FC<ProductCreationBasicInfoSectionProps> = ({
  form,
  errors,
  onSalesStatusChange,
  onVisibilityStatusChange,
  onMainImageChange,
  onAdditionalImagesChange,
  onChange,
}) => {
  // images 배열에서 첫 번째 요소를 대표 이미지로, 나머지를 추가 이미지로 분리
  const mainImage = form.images?.[0] || "";
  const additionalImages = form.images?.slice(1) || [];

  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
          노출 상품명
        </Label>
        <Input
          placeholder=""
          value={form.name}
          onChange={onChange("name")}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
      </div>
      <div>
        <SelectBox
          label="판매 여부"
          value={form.salesStatus}
          onChange={(value) => onSalesStatusChange(value as EnableStatus)}
          options={SALES_STATUS_OPTIONS}
          error={errors.salesStatus}
          required
        />
      </div>
      <div>
        <SelectBox
          label="노출 여부"
          value={form.visibilityStatus}
          onChange={(value) => onVisibilityStatusChange(value as EnableStatus)}
          options={VISIBILITY_STATUS_OPTIONS}
          error={errors.visibilityStatus}
          required
        />
      </div>
      <div>
        <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">판매가</Label>
        <Input
          placeholder=""
          type="number"
          value={form.salePrice || 0}
          onChange={onChange("salePrice")}
          className={errors.salePrice ? "border-destructive" : ""}
          min={0}
        />
        {errors.salePrice && <p className="text-sm text-destructive mt-1">{errors.salePrice}</p>}
      </div>

      <div>
        <MultipleImageUpload
          label="상품 대표 이미지"
          value={mainImage ? [mainImage] : []}
          onChange={(urls) => onMainImageChange(urls[0] || "")}
          error={errors.images}
          required
          maxImages={1}
        />
      </div>
      <div>
        <MultipleImageUpload
          label="추가 이미지"
          value={additionalImages}
          onChange={onAdditionalImagesChange}
          maxImages={7}
        />
      </div>
    </div>
  );
};
