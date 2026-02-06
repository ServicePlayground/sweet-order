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
}

export interface ReservationSelection {
  items: OrderItem[];
}

export interface ReservationBottomSheetProps {
  isOpen: boolean;
  price: number;
  cakeTitle: string;
  cakeImageUrl: string;
  cakeSizeOptions?: CakeSizeOption[];
  cakeFlavorOptions?: CakeFlavorOption[];
  cakeSize?: string;
  productType: ProductType;
  productNoticeProducer?: string;
  productNoticeAddress?: string;
  pickupAddress: string;
  pickupRoadAddress: string;
  onClose: () => void;
  onConfirm: (selection: ReservationSelection) => void;
}

export type ViewType = "options" | "calendar" | "confirm";
