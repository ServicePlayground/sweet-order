import React from "react";
import { IProductForm, ProductStatus } from "@/apps/web-seller/features/product/types/product.type";
import {
  SIZE_RANGE_OPTIONS,
  DELIVERY_METHOD_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
} from "@/apps/web-seller/features/product/constants/product.constant";
import { SelectBox } from "@/apps/web-seller/common/components/selectboxs/SelectBox";
import { MultiSelectBox } from "@/apps/web-seller/common/components/selectboxs/MultiSelectBox";
import { HashtagInput } from "@/apps/web-seller/common/components/inputs/HashtagInput";
import { Input } from "@/apps/web-seller/common/components/ui/input";
import { Label } from "@/apps/web-seller/common/components/ui/label";
import { Card, CardContent } from "@/apps/web-seller/common/components/ui/card";

interface Props {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onStockChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onStatusChange: (value: ProductStatus) => void;
  onSizeRangeChange: (values: string[]) => void;
  onDeliveryMethodChange: (values: string[]) => void;
  onHashtagsChange: (hashtags: string[]) => void;
}

// 상품 등록 폼 - 추가 설정 섹션
export const ProductCreationAdditionalSettingsSection: React.FC<Props> = ({
  form,
  errors,
  onStockChange,
  onStatusChange,
  onSizeRangeChange,
  onDeliveryMethodChange,
  onHashtagsChange,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-2">
          추가 설정
        </h2>
        <div className="border-t mb-6" />

        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label className="after:content-['*'] after:ml-0.5 after:text-destructive">
              재고수량
            </Label>
            <Input
              placeholder=""
              type="number"
              value={form.stock || 0}
              onChange={onStockChange}
              className={errors.stock ? "border-destructive" : ""}
              min={1}
            />
            {errors.stock ? (
              <p className="text-sm text-destructive mt-1">{errors.stock}</p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">1개 이상 필수</p>
            )}
          </div>

          <div>
            <SelectBox
              label="상품 상태"
              value={form.status}
              onChange={(value) => onStatusChange(value as ProductStatus)}
              options={PRODUCT_STATUS_OPTIONS}
              error={errors.status}
              required
            />
          </div>

          <div>
            <MultiSelectBox
              label="인원 수"
              value={form.sizeRange}
              onChange={onSizeRangeChange}
              options={SIZE_RANGE_OPTIONS}
              error={errors.sizeRange}
              required
            />
          </div>

          <div>
            <MultiSelectBox
              label="배송 방법"
              value={form.deliveryMethod}
              onChange={onDeliveryMethodChange}
              options={DELIVERY_METHOD_OPTIONS}
              error={errors.deliveryMethod}
              required
            />
          </div>

          <div>
            <HashtagInput
              label="해시태그"
              value={form.hashtags || []}
              onChange={onHashtagsChange}
              error={errors.hashtags}
              maxTags={10}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
