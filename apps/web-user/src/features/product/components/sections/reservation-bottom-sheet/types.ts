import {
  CakeFlavorOption,
  CakeSizeOption,
  ProductType,
} from "@/apps/web-user/features/product/types/product.type";

export interface OrderItem {
  date: Date | null;
  size: string;
  sizePrice: number;
  flavor: string;
  flavorPrice: number;
  cream: string;
  letteringMessage: string;
  requestMessage: string;
  quantity: number;
  imageFiles: File[]; // 업로드할 이미지 File 목록
  imageUrls: string[]; // 미리보기용 로컬 URL 목록 (blob URL)
}

export interface ReservationBottomSheetProps {
  isOpen: boolean;
  productId: string;
  price: number;
  cakeTitle: string;
  cakeImageUrl: string;
  cakeImages?: string[];
  cakeSizeOptions?: CakeSizeOption[];
  cakeFlavorOptions?: CakeFlavorOption[];
  cakeSize?: string;
  productType: ProductType;
  productNoticeProducer?: string;
  productNoticeAddress?: string;
  storeName: string;
  // 픽업장소
  pickupAddress: string;
  pickupRoadAddress: string;
  pickupDetailAddress?: string;
  pickupZonecode: string;
  pickupLatitude: number;
  pickupLongitude: number;
  onClose: () => void;
}

export type ViewType = "options" | "calendar" | "confirm";
