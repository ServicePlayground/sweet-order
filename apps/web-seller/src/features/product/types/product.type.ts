export enum EnableStatus {
  ENABLE = "ENABLE", // 사용 (판매중/노출)
  DISABLE = "DISABLE", // 미사용 (판매중지/숨김)
}

export enum OptionRequired {
  REQUIRED = "REQUIRED", // 필수
  OPTIONAL = "OPTIONAL", // 선택
}

// 케이크 사이즈 옵션
export interface CakeSizeOption {
  visible: EnableStatus;
  displayName: string;
  description: string;
}

// 케이크 맛 옵션
export interface CakeFlavorOption {
  visible: EnableStatus;
  displayName: string;
}

export interface IProductForm {
  // 기본 정보
  mainImage: string;
  additionalImages?: string[];
  name: string;
  salePrice: number;
  salesStatus: EnableStatus;
  visibilityStatus: EnableStatus;

  // 케이크 옵션
  cakeSizeOptions?: CakeSizeOption[];
  cakeFlavorOptions?: CakeFlavorOption[];

  // 레터링 정책
  letteringVisible: EnableStatus;
  letteringRequired: OptionRequired;
  letteringMaxLength: number;
  imageUploadEnabled: EnableStatus;

  // 상세정보
  detailDescription?: string;

  // 상품정보제공고시
  productNoticeFoodType: string;
  productNoticeProducer: string;
  productNoticeOrigin: string;
  productNoticeAddress: string;
  productNoticeManufactureDate: string;
  productNoticeExpirationDate: string;
  productNoticePackageCapacity: string;
  productNoticePackageQuantity: string;
  productNoticeIngredients: string;
  productNoticeCalories: string;
  productNoticeSafetyNotice: string;
  productNoticeGmoNotice: string;
  productNoticeImportNotice: string;
  productNoticeCustomerService: string;
}

// 상품 등록 요청
export interface ICreateProductRequest extends IProductForm {
  storeId: string;
}

// 상품 등록 응답
export interface ICreateProductResponse {
  id: string;
}
