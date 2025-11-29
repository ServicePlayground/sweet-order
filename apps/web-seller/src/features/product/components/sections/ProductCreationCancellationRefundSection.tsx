import React from "react";
import { RichTextEditor } from "@/apps/web-seller/common/components/editors/RichTextEditor";
import { IProductForm } from "@/apps/web-seller/features/product/types/product.type";

export interface ProductCreationCancellationRefundSectionProps {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onChange: (value: string) => void;
}

// 상품 등록 폼 - 취소 및 환불 섹션
export const ProductCreationCancellationRefundSection: React.FC<
  ProductCreationCancellationRefundSectionProps
> = ({ form, errors, onChange }) => {
  const placeholder =
    "취소 및 환불 정보를 입력해주세요. 취소 가능 기간, 환불 방법 등에 대한 내용을 자세히 설명해주세요.";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        취소 및 환불 정책
      </h2>

      <p className="text-sm text-muted-foreground mb-2">
        취소 및 환불 정보는 선택 입력 항목입니다. 고객이 확인할 수 있는 취소 및 환불 관련 정보를
        입력해주세요.
      </p>

      {errors.cancellationRefundDetailDescription && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-2">
          {errors.cancellationRefundDetailDescription}
        </div>
      )}

      <RichTextEditor
        value={form.cancellationRefundDetailDescription || ""}
        onChange={onChange}
        placeholder={placeholder}
        minHeight={400}
        error={!!errors.cancellationRefundDetailDescription}
      />
    </div>
  );
};
