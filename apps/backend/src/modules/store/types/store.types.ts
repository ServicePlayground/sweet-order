/**
 * 스토어 정보 인터페이스
 * Store 엔티티의 주요 필드를 포함하는 스토어 정보 구조를 정의합니다.
 */
export interface StoreInfo {
  id: string;
  userId: string;
  logoImageUrl?: string;
  name: string;
  description?: string;
  // 사업자 정보
  businessNo: string;
  representativeName: string;
  openingDate: string;
  businessName: string;
  businessSector: string;
  businessType: string;
  // 통신판매사업자 정보
  permissionManagementNumber: string;
  // 시스템 필드
  likeCount: number;
  // 후기 통계
  averageRating: number; // 해당 스토어의 모든 상품 후기들의 평균 별점
  totalReviewCount: number; // 해당 스토어의 모든 상품 후기 개수
  createdAt: Date;
  updatedAt: Date;
}
