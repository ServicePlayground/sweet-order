import React from "react";
import { IProductForm, MainCategory } from "@/apps/web-seller/features/product/types/product.type";
import { MAIN_CATEGORY_OPTIONS } from "@/apps/web-seller/features/product/constants/product.constant";
import { MultipleImageUpload } from "@/apps/web-seller/common/components/images/MultipleImageUpload";
import { SelectBox } from "@/apps/web-seller/common/components/selectboxs/SelectBox";
import { Input } from "@/apps/web-seller/common/components/ui/input";
import { Label } from "@/apps/web-seller/common/components/ui/label";

export interface ProductCreationBasicInfoSectionProps {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onCategoryChange: (value: MainCategory) => void;
  onImagesChange: (urls: string[]) => void;
  onChange: (
    key: keyof IProductForm,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// 상품 등록 폼 - 기본 정보 섹션
export const ProductCreationBasicInfoSection: React.FC<ProductCreationBasicInfoSectionProps> = ({
  form,
  errors,
  onCategoryChange,
  onImagesChange,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <SelectBox
          label="카테고리"
          value={form.mainCategory}
          onChange={(value) => onCategoryChange(value as MainCategory)}
          options={MAIN_CATEGORY_OPTIONS}
          error={errors.mainCategory}
          required
        />
      </div>

      <div>
        <MultipleImageUpload
          label="상품 대표 이미지"
          value={form.images || []}
          onChange={onImagesChange}
          error={errors.images}
          required
        />
      </div>

      <div>
        <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
          상품명
        </Label>
        <Input
          placeholder=""
          value={form.name}
          onChange={onChange("name")}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Label>설명</Label>
        <textarea
          placeholder="상품에 대한 설명을 입력해주세요"
          rows={4}
          value={form.description || ""}
          onChange={onChange("description")}
          className={`flex min-h-[80px] w-full rounded-md border ${
            errors.description ? "border-destructive" : "border-input"
          } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
          정가
        </Label>
        <Input
          placeholder=""
          type="number"
          value={form.originalPrice || 0}
          onChange={onChange("originalPrice")}
          className={errors.originalPrice ? "border-destructive" : ""}
          min={0}
        />
        {errors.originalPrice && (
          <p className="text-sm text-destructive mt-1">{errors.originalPrice}</p>
        )}
      </div>

      <div>
        <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
          판매가
        </Label>
        <Input
          placeholder=""
          type="number"
          value={form.salePrice || 0}
          onChange={onChange("salePrice")}
          className={errors.salePrice ? "border-destructive" : ""}
          min={0}
        />
        {errors.salePrice && (
          <p className="text-sm text-destructive mt-1">{errors.salePrice}</p>
        )}
      </div>

      <div>
        <Label>대표 안내 사항</Label>
        <textarea
          placeholder="예: 주문 후 1-2일 내 제작 완료"
          rows={2}
          value={form.notice || ""}
          onChange={onChange("notice")}
          className={`flex min-h-[80px] w-full rounded-md border ${
            errors.notice ? "border-destructive" : "border-input"
          } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        />
        {errors.notice && (
          <p className="text-sm text-destructive mt-1">{errors.notice}</p>
        )}
      </div>

      <div>
        <Label>대표 주의사항</Label>
        <textarea
          placeholder="예: 냉장 보관 필수, 3일 이내 섭취 권장"
          rows={2}
          value={form.caution || ""}
          onChange={onChange("caution")}
          className={`flex min-h-[80px] w-full rounded-md border ${
            errors.caution ? "border-destructive" : "border-input"
          } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        />
        {errors.caution && (
          <p className="text-sm text-destructive mt-1">{errors.caution}</p>
        )}
      </div>

      <div>
        <Label>기본 제공</Label>
        <Input
          placeholder="예: 케이크, 촛불, 포크"
          value={form.basicIncluded || ""}
          onChange={onChange("basicIncluded")}
          className={errors.basicIncluded ? "border-destructive" : ""}
        />
        {errors.basicIncluded && (
          <p className="text-sm text-destructive mt-1">{errors.basicIncluded}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">공백이면 상품페이지에서 보이지 않습니다</p>
      </div>
    </div>
  );
};
