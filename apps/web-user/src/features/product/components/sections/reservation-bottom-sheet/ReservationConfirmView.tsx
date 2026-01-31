"use client";

import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { Icon } from "@/apps/web-user/common/components/icons";
import { OrderItem } from "./types";
import Image from "next/image";

interface ReservationConfirmViewProps {
  orderItems: OrderItem[];
  cakeTitle: string;
  cakeImageUrl: string;
  price: number;
  formatDateTime: (date: Date | null) => string;
  handleEditItem: (index: number) => void;
  handleDeleteClick: (index: number) => void;
  handleQuantityChange: (index: number, delta: number) => void;
  handleAddNewItem: () => void;
}

export function ReservationConfirmView({
  orderItems,
  cakeTitle,
  cakeImageUrl,
  price,
  formatDateTime,
  handleEditItem,
  handleDeleteClick,
  handleQuantityChange,
  handleAddNewItem,
}: ReservationConfirmViewProps) {
  return (
    <div className="px-[20px] py-[24px] flex flex-col gap-[16px]">
      {orderItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-[20px] py-[22px] text-center text-sm text-gray-700">
          <Image src="/images/contents/none_items.png" alt="empty-cart" width={62} height={57} />
          담은 상품이 없어요
        </div>
      ) : (
        orderItems.map((item, index) => (
          <div key={index} className="flex flex-col rounded-lg overflow-hidden">
            <div className="flex items-center gap-[12px] py-[12px] px-[10px] text-sm bg-blue border-b border-gray-100">
              <div className="flex items-center gap-[2px] font-bold text-blue-dark">
                <Icon name="takeout" width={16} height={16} className="text-blue-dark" />
                픽업
              </div>
              <div className="text-sm text-gray-900">{formatDateTime(item.date)}</div>
            </div>

            <div className="py-[10px] px-[18px] bg-gray-50">
              <div className="flex pb-[12px] border-b border-gray-100">
                <div className="flex-1 flex flex-col gap-[4px]">
                  <div className="text-sm font-bold text-gray-900">{cakeTitle}</div>
                  <div className="text-sm font-bold text-gray-900">{price.toLocaleString()}원</div>
                  <ul className="text-xs text-gray-700 pl-[18px] list-disc">
                    <li>사이즈 : {item.size}</li>
                    <li>맛 : {item.flavor}</li>
                    <li>레터링 : {item.letteringMessage}</li>
                    {item.requestMessage && <li>요청사항 : {item.requestMessage}</li>}
                  </ul>
                </div>

                <div className="w-[64px] h-[64px] overflow-hidden shrink-0 rounded-md">
                  <img src={cakeImageUrl} alt={cakeTitle} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-[12px]">
                <span className="w-[73px]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded"
                    onClick={() => handleEditItem(index)}
                  >
                    옵션변경
                  </Button>
                </span>

                <div className="flex items-center h-[38px] rounded overflow-hidden">
                  {item.quantity === 1 ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(index)}
                      className="w-[30px] h-full flex items-center justify-center bg-gray-100"
                      aria-label="삭제"
                    >
                      <Icon name="trash" width={14} height={14} className="text-gray-900" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, -1)}
                      className="w-[30px] h-full flex items-center justify-center bg-gray-100"
                      aria-label="수량 감소"
                    >
                      <Icon name="minus" width={14} height={14} className="text-gray-900" />
                    </button>
                  )}
                  <span className="w-[40px] h-full flex items-center justify-center text-sm text-gray-900 border border-gray-100 bg-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(index, 1)}
                    className="w-[30px] h-full flex items-center justify-center bg-gray-100"
                    aria-label="수량 증가"
                  >
                    <Icon name="plus" width={14} height={14} className="text-gray-900" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        onClick={handleAddNewItem}
        className="flex items-center justify-center gap-[6px] w-full h-[52px] text-base font-bold text-gray-900 border border-gray-100 rounded-lg"
      >
        <Icon name="plus" width={20} height={20} className="text-gray-900" />
        <span className="text-base font-bold text-gray-900">상품추가</span>
      </button>
    </div>
  );
}
