"use client";

import { use, useState } from "react";
import { useProductDetail } from "@/apps/web-user/features/product/hooks/queries/useProductDetail";
import { useProductIsLiked } from "@/apps/web-user/features/product/hooks/queries/useProductIsLiked";
import { useAddProductLike } from "@/apps/web-user/features/product/hooks/mutations/useAddProductLike";
import { useRemoveProductLike } from "@/apps/web-user/features/product/hooks/mutations/useRemoveProductLike";
import { ProductDetailImageGallerySection } from "@/apps/web-user/features/product/components/sections/ProductDetailImageGallerySection";
import { ProductDetailInfoSection } from "@/apps/web-user/features/product/components/sections/ProductDetailInfoSection";
import { ProductDetailDescriptionSection } from "@/apps/web-user/features/product/components/sections/ProductDetailDescriptionSection";
import { ProductDetailInformationNoticeSection } from "@/apps/web-user/features/product/components/sections/ProductDetailInformationNoticeSection";
import { ProductDetailReviewSection } from "@/apps/web-user/features/product/components/sections/ProductDetailReviewSection";
import { Tabs } from "@/apps/web-user/common/components/tabs/Tabs";
import { ProductDetailSizeFlavorSection } from "@/apps/web-user/features/product/components/sections/ProductDetailSizeFlavorSection";
import { Icon } from "@/apps/web-user/common/components/icons";
import { BottomSheet } from "@/apps/web-user/common/components/bottom-sheets/BottomSheet";
import { Button } from "@/apps/web-user/common/components/buttons/Button";

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = use(params);
  const { data, isLoading } = useProductDetail(productId);
  const { data: likeData } = useProductIsLiked(productId);
  const { mutate: addLike, isPending: isAddingLike } = useAddProductLike();
  const { mutate: removeLike, isPending: isRemovingLike } = useRemoveProductLike();

  const isLiked = likeData?.isLiked ?? false;
  const isLikeLoading = isAddingLike || isRemovingLike;

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleLikeToggle = () => {
    if (isLikeLoading) return;

    if (isLiked) {
      removeLike(productId);
    } else {
      addLike(productId);
    }
  };

  if (isLoading) {
    return <></>;
  }

  if (!data) {
    return (
      <div className="w-full mx-auto px-5 py-6 text-center text-gray-500">
        상품 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="pb-[100px]">
      {/* 이미지 갤러리 */}
      <ProductDetailImageGallerySection images={data.images} productName={data.name} />
      {/* 상품 정보 */}
      <ProductDetailInfoSection product={data} />

      {/* 탭 영역 */}
      <Tabs
        defaultTab="detail"
        tabs={[
          {
            id: "detail",
            label: "상세정보",
            content: <ProductDetailDescriptionSection detailDescription={data.detailDescription} />,
          },
          {
            id: "size-flavor",
            label: "사이즈·맛",
            content: (
              <ProductDetailSizeFlavorSection
                cakeSizeOptions={data.cakeSizeOptions}
                cakeFlavorOptions={data.cakeFlavorOptions}
              />
            ),
          },
          {
            id: "review",
            label: "후기",
            content: <ProductDetailReviewSection />,
          },
          {
            id: "notice",
            label: "이용안내",
            content: (
              <ProductDetailInformationNoticeSection
                product={data}
                cancellationRefundDetailDescription="취소 및 환불규정의 내용이 들어갑니다."
              />
            ),
          },
        ]}
      />

      {/* 예약하기, 좋아요 - 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[638px] bg-white border-gray-200 flex flex-col shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.16)]">
        <div className="flex items-center gap-[16px] px-[20px] py-[10px]">
          <button
            type="button"
            onClick={handleLikeToggle}
            disabled={isLikeLoading}
            className={`flex flex-col items-center justify-center w-[40px] h-[40px] ${isLikeLoading ? "opacity-50" : ""}`}
          >
            <Icon
              name={isLiked ? "favoriteFilled" : "favorite"}
              width={24}
              height={24}
              className={isLiked ? "text-primary" : "text-gray-500"}
            />
            <span className="text-xs text-gray-900 font-bold">{data.likeCount}</span>
          </button>
          <Button onClick={() => setIsBottomSheetOpen(true)} flex>
            예약하기
          </Button>
        </div>
      </div>

      {/* 예약 바텀시트 */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="상품 옵션 선택"
        footer={
          <div className="px-[20px]">
            <div className="flex items-center justify-between pt-[14px]">
              <span className="text-sm text-gray-700">총 금액</span>
              <span className="text-xl font-bold text-gray-900">
                {data.salePrice.toLocaleString()}원
              </span>
            </div>
            <div className="py-[12px] flex gap-[8px]">
              <Button variant="outline" width={100}>
                취소
              </Button>
              <Button flex>선택완료</Button>
            </div>
          </div>
        }
      >
        <div className="px-[20px] py-[16px]">
          {/* 바텀시트 컨텐츠 영역 */}
          <p className="text-gray-500">예약 옵션을 선택해주세요.</p>
        </div>
      </BottomSheet>
    </div>
  );
}
