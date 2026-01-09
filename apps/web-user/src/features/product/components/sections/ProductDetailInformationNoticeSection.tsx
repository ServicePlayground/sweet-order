"use client";

import { Product } from "@/apps/web-user/features/product/types/product.type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/apps/web-user/common/components/@shadcn-ui/accordion";

interface ProductDetailInformationNoticeSectionProps {
  product: Product;
  variant?: "default" | "tab";
  cancellationRefundDetailDescription?: string;
}

interface NoticeItem {
  label: string;
  value: string;
}

export function ProductDetailInformationNoticeSection({
  product,
  variant = "default",
  cancellationRefundDetailDescription,
}: ProductDetailInformationNoticeSectionProps) {
  const isTabVariant = variant === "tab";

  const noticeItems: NoticeItem[] = [
    { label: "상품번호", value: product.productNumber },
    { label: "제품명", value: product.name },
    { label: "식품의 유형", value: product.productNoticeFoodType },
    { label: "제조사", value: product.productNoticeProducer },
    { label: "원산지", value: product.productNoticeOrigin },
    { label: "소재지", value: product.productNoticeAddress },
    { label: "제조연월일", value: product.productNoticeManufactureDate },
    { label: "소비기한 또는 품질유지기한", value: product.productNoticeExpirationDate },
    { label: "포장단위별 용량/수량", value: product.productNoticePackageCapacity },
    { label: "포장 단위별 수량", value: product.productNoticePackageQuantity },
    { label: "원재료명 및 함량", value: product.productNoticeIngredients },
    { label: "영양성분", value: product.productNoticeCalories },
    { label: "소비자안전을 위한 주의사항", value: product.productNoticeSafetyNotice },
    { label: "유전자변형식품에 해당하는 경우", value: product.productNoticeGmoNotice },
    { label: "수입식품의 경우", value: product.productNoticeImportNotice },
    { label: "고객센터", value: product.productNoticeCustomerService },
  ];

  return (
    <div
      style={{
        backgroundColor: isTabVariant ? "transparent" : "#ffffff",
        borderRadius: isTabVariant ? 0 : "12px",
        padding: isTabVariant ? 0 : "32px",
        boxShadow: isTabVariant ? "none" : "0 2px 8px rgba(0, 0, 0, 0.04)",
        marginTop: isTabVariant ? 0 : "32px",
      }}
    >
      <Accordion type="single" collapsible defaultValue={!isTabVariant ? "notice-info" : undefined}>
        <AccordionItem value="notice-info" style={{ border: "none" }}>
          <AccordionTrigger
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
              paddingBottom: "16px",
            }}
          >
            상품정보제공고시
          </AccordionTrigger>
          <AccordionContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {noticeItems.map((item, index) => (
                <div key={index}>
                  <div
                    style={{
                      display: "flex",
                      padding: "16px 0",
                      borderBottom: index < noticeItems.length - 1 ? "1px solid #e5e7eb" : "none",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "200px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#6b7280",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: "14px",
                        color: "#111827",
                        lineHeight: "1.5",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.value || "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="cancellation-refund" style={{ border: "none" }}>
          <AccordionTrigger
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
              paddingBottom: "16px",
            }}
          >
            취소 및 환불
          </AccordionTrigger>
          <AccordionContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {cancellationRefundDetailDescription && (
                <div dangerouslySetInnerHTML={{ __html: cancellationRefundDetailDescription }} />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
