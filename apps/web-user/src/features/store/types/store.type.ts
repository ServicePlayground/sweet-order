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
  createdAt: Date;
  updatedAt: Date;
}
