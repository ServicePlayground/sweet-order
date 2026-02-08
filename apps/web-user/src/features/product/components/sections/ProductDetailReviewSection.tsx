"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Review, ReviewSortBy } from "@/apps/web-user/features/review/types/review.type";
import { useProductReviews } from "@/apps/web-user/features/review/hooks/queries/useProductReviews";
import { ProductDetailSubTitle } from "../common/ProductDetailSubTitle";
import { ImageSlider, SliderImage } from "@/apps/web-user/common/components/sliders";
import { Icon } from "@/apps/web-user/common/components/icons";
import { ReviewDetailModal } from "../modals/ReviewDetailModal";
import { PhotoReviewListModal } from "../modals/PhotoReviewListModal";

interface ReviewImage extends SliderImage {
  reviewId: string;
}

interface ProductDetailReviewSectionProps {
  productId: string;
}

interface ReviewItemProps {
  review: Review;
  onImageClick: (review: Review) => void;
}

function ReviewItem({ review, onImageClick }: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [review.content]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const renderRating = (rating: number) => {
    const roundedRating = Math.round(rating);
    return (
      <span className="flex items-center gap-[2px]">
        <Icon name="star" width={18} height={18} className="text-[#F7CE45]" />
        <span className="font-bold text-gray-900">{roundedRating}</span>
      </span>
    );
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between mb-[12px]">
        <span className="text-sm font-medium text-gray-900">{renderRating(review.rating)}</span>
        <div className="flex items-center gap-[24px]">
          <span className="relative text-sm text-gray-500 before:content-[''] before:absolute before:right-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[1px] before:h-[8px] before:bg-gray-300">
            {formatDate(review.createdAt)}
          </span>
          <span className="font-bold text-sm text-gray-900">{review.userNickname || "익명"}</span>
        </div>
      </div>

      <div>
        <p
          ref={contentRef}
          className={`text-sm text-gray-700 leading-[140%] ${!isExpanded ? "line-clamp-3" : ""}`}
        >
          {review.content}
        </p>
        {isTruncated && !isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-sm text-gray-500 mt-[4px]"
          >
            더보기
          </button>
        )}
        {isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-sm text-gray-500 mt-[4px]"
          >
            접기
          </button>
        )}
      </div>

      {/* 리뷰 이미지 */}
      {review.imageUrls.length > 0 && (
        <div className="mt-[12px]">
          <ImageSlider
            images={review.imageUrls.map((url, idx) => ({
              id: `${review.id}-${idx}`,
              url,
            }))}
            imageWidth={160}
            imageHeight={120}
            gap={4}
            onImageClick={() => onImageClick(review)}
          />
        </div>
      )}
    </div>
  );
}

export function ProductDetailReviewSection({ productId }: ProductDetailReviewSectionProps) {
  const [sortBy, setSortBy] = useState<ReviewSortBy>(ReviewSortBy.LATEST);
  const [isReviewDetailModalOpen, setIsReviewDetailModalOpen] = useState(false);
  const [isPhotoListModalOpen, setIsPhotoListModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | undefined>(undefined);
  const [modalReviews, setModalReviews] = useState<Review[]>([]);

  // 사진 후기용 - 항상 최신순
  const { data: photoReviewData } = useProductReviews({
    productId,
    sortBy: ReviewSortBy.LATEST,
  });

  // 후기 목록용 - 사용자 선택
  const { data: reviewData } = useProductReviews({ productId, sortBy });

  // 사진 후기 이미지 (최신순)
  const allPhotoImages: ReviewImage[] = useMemo(() => {
    if (!photoReviewData?.data) return [];

    return photoReviewData.data.flatMap((review) =>
      review.imageUrls.map((url: string, idx: number) => ({
        id: `${review.id}-${idx}`,
        url,
        reviewId: review.id,
      })),
    );
  }, [photoReviewData]);

  // 이미지가 있는 리뷰만 필터링 (사진 후기용)
  const reviewsWithImages = useMemo(() => {
    return photoReviewData?.data.filter((r) => r.imageUrls.length > 0) ?? [];
  }, [photoReviewData]);

  const handlePhotoClick = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setModalReviews(reviewsWithImages);
    setIsReviewDetailModalOpen(true);
  };

  const handleViewAllClick = () => {
    setIsPhotoListModalOpen(true);
  };

  const handleSortChange = (newSortBy: ReviewSortBy) => {
    setSortBy(newSortBy);
  };

  const handleReviewImageClick = (review: Review) => {
    setSelectedReviewId(review.id);
    setModalReviews([review]);
    setIsReviewDetailModalOpen(true);
  };

  return (
    <div>
      {/* 사진 후기 */}
      {allPhotoImages.length >= 10 && (
        <>
          <ProductDetailSubTitle>사진 후기</ProductDetailSubTitle>
          <div
            className="mt-[12px] mb-[33px] flex gap-[4px] overflow-x-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {allPhotoImages.map((image, index) => {
              const isLast = index === allPhotoImages.length - 1;
              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={isLast ? handleViewAllClick : () => handlePhotoClick(image.reviewId)}
                  className="relative flex-shrink-0 rounded-xl overflow-hidden"
                  style={{ width: 130, height: 130 }}
                >
                  <Image
                    src={image.url}
                    alt={`사진 후기 ${index + 1}`}
                    width={130}
                    height={130}
                    className="w-full h-full object-cover"
                  />
                  {isLast && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">모두보기</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* 후기 목록 */}
      <div className="flex items-center justify-between">
        <ProductDetailSubTitle>후기 {reviewData?.data?.length ?? 0}</ProductDetailSubTitle>
        <div className="flex gap-[8px]">
          <button
            type="button"
            onClick={() => handleSortChange(ReviewSortBy.LATEST)}
            className={`px-[4px] py-[2px] text-sm ${sortBy === ReviewSortBy.LATEST ? "text-gray-900 font-bold" : "text-gray-300"}`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => handleSortChange(ReviewSortBy.RATING_DESC)}
            className={`px-[4px] py-[2px] text-sm ${sortBy === ReviewSortBy.RATING_DESC ? "text-gray-900 font-bold" : "text-gray-300"}`}
          >
            별점순
          </button>
        </div>
      </div>

      {/* 리뷰 리스트 */}
      <div className="mt-3">
        {reviewData?.data && reviewData.data.length > 0 ? (
          reviewData.data.map((review) => (
            <ReviewItem key={review.id} review={review} onImageClick={handleReviewImageClick} />
          ))
        ) : (
          <p className="text-sm text-gray-500 py-4">등록된 후기가 없습니다.</p>
        )}
      </div>

      {/* 사진 후기 리스트 모달 */}
      <PhotoReviewListModal
        isOpen={isPhotoListModalOpen}
        onClose={() => setIsPhotoListModalOpen(false)}
        images={allPhotoImages}
        onImageClick={handlePhotoClick}
      />

      {/* 후기 상세 모달 */}
      <ReviewDetailModal
        isOpen={isReviewDetailModalOpen}
        onClose={() => setIsReviewDetailModalOpen(false)}
        reviews={modalReviews}
        initialReviewId={selectedReviewId}
      />
    </div>
  );
}
