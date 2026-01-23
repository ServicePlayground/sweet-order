"use client";

import DOMPurify from "isomorphic-dompurify";
import { ProductDetailSubTitle } from "../common/ProductDetailSubTitle";

interface ProductDetailDescriptionSectionProps {
  detailDescription?: string;
}

export function ProductDetailDescriptionSection({
  detailDescription,
}: ProductDetailDescriptionSectionProps) {
  if (!detailDescription) {
    return null;
  }

  const sanitizedDescription = DOMPurify.sanitize(detailDescription);

  return (
    <div>
      <ProductDetailSubTitle>상품 상세 설명</ProductDetailSubTitle>
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
    </div>
  );
}
