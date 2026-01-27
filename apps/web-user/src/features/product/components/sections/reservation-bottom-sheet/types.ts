import {
  CakeFlavorOption,
  CakeSizeOption,
} from "@/apps/web-user/features/product/types/product.type";

export interface OrderItem {
  date: Date | null;
  size: string;
  flavor: string;
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
  onClose: () => void;
  onConfirm: (selection: ReservationSelection) => void;
}

export type ViewType = "options" | "calendar" | "confirm";
