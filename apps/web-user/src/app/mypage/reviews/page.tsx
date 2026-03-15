"use client";

import { useState } from "react";
import Header from "@/apps/web-user/common/components/headers/Header";
import { ReviewSortBy } from "@/apps/web-user/features/review/types/review.type";
import { useMyReviews } from "@/apps/web-user/features/review/hooks/queries/useMyReviews";
import { useDeleteMyReview } from "@/apps/web-user/features/review/hooks/mutations/useDeleteMyReview";
import { MyReviewItem } from "@/apps/web-user/features/review/components/MyReviewItem";
import { ReviewDetailModal } from "@/apps/web-user/features/product/components/modals/ReviewDetailModal";
import { Toast } from "@/apps/web-user/common/components/toast/Toast";
import { useConfirmStore } from "@/apps/web-user/common/store/confirm.store";
import type { Review, MyReview } from "@/apps/web-user/features/review/types/review.type";

export default function MyReviewsPage() {
  const [sortBy] = useState<ReviewSortBy>(ReviewSortBy.LATEST);
  const { data } = useMyReviews({ sortBy });
  const { mutate: deleteReview } = useDeleteMyReview();
  const { showConfirm } = useConfirmStore();

  const reviews = data?.data ?? [];
  const totalCount = data?.meta?.totalItems ?? 0;

  const [isReviewDetailModalOpen, setIsReviewDetailModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | undefined>(undefined);
  const [modalReviews, setModalReviews] = useState<Review[]>([]);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const handleImageClick = (review: MyReview) => {
    setSelectedReviewId(review.id);
    setModalReviews([review]);
    setIsReviewDetailModalOpen(true);
  };

  const handleDelete = (reviewId: string) => {
    showConfirm({
      title: "후기 삭제",
      message: "후기를 삭제하시겠습니까?",
      onConfirm: () =>
        deleteReview(reviewId, {
          onSuccess: () => setShowDeleteToast(true),
        }),
    });
  };

  return (
    <div>
      <Header variant="back-title" title={`내 후기${data ? ` ${totalCount}` : ""}`} />

      {/* 후기 목록 */}
      <div className="px-5">
        {!data ? null : reviews.length > 0 ? (
          reviews.map((review) => (
            <MyReviewItem
              key={review.id}
              review={review}
              onDelete={handleDelete}
              onImageClick={handleImageClick}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 py-10 text-center">작성한 후기가 없습니다.</p>
        )}
      </div>

      {/* 후기 이미지 상세 모달 */}
      <ReviewDetailModal
        isOpen={isReviewDetailModalOpen}
        onClose={() => setIsReviewDetailModalOpen(false)}
        reviews={modalReviews}
        initialReviewId={selectedReviewId}
      />
      {showDeleteToast && (
        <Toast
          message="후기가 삭제되었습니다!"
          iconName="checkCircle"
          iconClassName="text-green-400"
          onClose={() => setShowDeleteToast(false)}
        />
      )}
    </div>
  );
}
