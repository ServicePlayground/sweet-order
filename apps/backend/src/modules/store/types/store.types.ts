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
  businessNo: string;
  representativeName: string;
  openingDate: string;
  businessName: string;
  businessSector: string;
  businessType: string;
  permissionManagementNumber: string;
  createdAt: Date;
  updatedAt: Date;
}
