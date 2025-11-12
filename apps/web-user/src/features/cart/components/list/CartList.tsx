"use client";

import Image from "next/image";
import Link from "next/link";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { CartItem } from "@/apps/web-user/features/cart/types/cart.type";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { calculateTotalPrice } from "@/apps/web-user/features/product/utils/price.util";
import { getOrderFormDisplayItems } from "@/apps/web-user/features/product/utils/orderForm-validator.util";
import { getDeliveryMethodLabel } from "@/apps/web-user/features/product/utils/deliveryMethod.util";

interface CartListProps {
  items: CartItem[];
  onQuantityChange: (cartItem: CartItem, newQuantity: number) => void;
  onRemove: (cartItemId: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

export function CartList({
  items,
  onQuantityChange,
  onRemove,
  isUpdating,
  isRemoving,
}: CartListProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            gap: "20px",
          }}
        >
          {/* 상품 이미지 */}
          <Link href={PATHS.PRODUCT.DETAIL(item.product.id)}>
            <div
              style={{
                width: "120px",
                height: "120px",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </Link>

          {/* 상품 정보 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div style={{ flex: 1 }}>
                <Link href={PATHS.PRODUCT.DETAIL(item.product.id)}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {item.product.name}
                  </h3>
                </Link>
                {item.product.description && (
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.product.description}
                  </p>
                )}
              </div>
              <Button
                onClick={() => onRemove(item.id)}
                disabled={isRemoving}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "transparent",
                  color: "#ef4444",
                  fontSize: "20px",
                  minWidth: "auto",
                }}
              >
                ×
              </Button>
            </div>

            {/* 가격 및 수량 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {item.product.originalPrice > item.product.salePrice && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#9ca3af",
                      textDecoration: "line-through",
                    }}
                  >
                    {item.product.originalPrice.toLocaleString()}원
                  </span>
                )}
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {item.product.salePrice.toLocaleString()}원
                </span>
              </div>

              {/* 수량 조절 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "4px",
                }}
              >
                <Button
                  onClick={() => onQuantityChange(item, item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  style={{
                    width: "32px",
                    height: "32px",
                    padding: 0,
                    backgroundColor: "transparent",
                    color: "#6b7280",
                    fontSize: "20px",
                    minWidth: "auto",
                  }}
                >
                  −
                </Button>
                <span
                  style={{
                    minWidth: "40px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {item.quantity}
                </span>
                <Button
                  onClick={() => onQuantityChange(item, item.quantity + 1)}
                  disabled={isUpdating}
                  style={{
                    width: "32px",
                    height: "32px",
                    padding: 0,
                    backgroundColor: "transparent",
                    color: "#6b7280",
                    fontSize: "20px",
                    minWidth: "auto",
                  }}
                >
                  +
                </Button>
              </div>
            </div>

            {/* 수령 방식 표시 */}
            {item.deliveryMethod && (
              <div
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#f0f9ff",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#0369a1",
                  fontWeight: 500,
                }}
              >
                수령 방식: {getDeliveryMethodLabel(item.deliveryMethod)}
              </div>
            )}

            {/* 주문 폼 데이터 표시 (있는 경우) */}
            {(() => {
              const displayItems = getOrderFormDisplayItems(
                item.product.orderFormSchema || undefined,
                item.orderFormData || undefined,
              );

              if (displayItems.length === 0) return null;

              return (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  {displayItems.map((displayItem) => (
                    <div key={displayItem.fieldId} style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: "#374151" }}>
                            {displayItem.fieldLabel}:
                          </strong>{" "}
                          <span>{displayItem.displayValue}</span>
                        </div>
                        {displayItem.additionalPrice > 0 && (
                          <span
                            style={{
                              color: "#111827",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            +{displayItem.additionalPrice.toLocaleString()}원
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* 총 가격 */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                소계:
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {(
                  calculateTotalPrice(
                    item.product.salePrice,
                    item.product.orderFormSchema || undefined,
                    item.orderFormData || {},
                  ) * item.quantity
                ).toLocaleString()}
                원
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

