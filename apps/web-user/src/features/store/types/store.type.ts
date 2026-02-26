export interface StoreListResponse {
  data: StoreInfo[];
  meta: {
    currentPage: number;
    hasNext: boolean;
    totalCount: number;
  };
}

export interface StoreInfo {
  id: string;
  userId: string;
  logoImageUrl?: string;
  name: string;
  description?: string;
  isLiked: boolean | null;
  // 사업자 정보
  businessNo: string;
  representativeName: string;
  openingDate: string;
  businessName: string;
  businessSector: string;
  businessType: string;
  // 통신판매사업자 정보
  permissionManagementNumber: string;
  // 주소/위치 정보
  address: string;
  roadAddress: string;
  detailAddress: string;
  zonecode: string;
  latitude: number;
  longitude: number;
  // 시스템 필드
  likeCount: number;
  // 후기 통계
  averageRating: number; // 해당 스토어의 모든 상품 후기들의 평균 별점
  totalReviewCount: number; // 해당 스토어의 모든 상품 후기 개수
  createdAt: Date;
  updatedAt: Date;
}
