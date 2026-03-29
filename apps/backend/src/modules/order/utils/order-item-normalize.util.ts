import { BadRequestException } from "@nestjs/common";
import { CreateOrderItemDto } from "@apps/backend/modules/order/dto/order-create.dto";
import { ORDER_ERROR_MESSAGES } from "@apps/backend/modules/order/constants/order.constants";
import { EnableStatus } from "@apps/backend/modules/product/constants/product.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

export type ParsedSizeOption = {
  id: string;
  visible: EnableStatus;
  displayName: string;
  lengthCm?: number;
  description?: string;
  price: number;
};

export type ParsedFlavorOption = {
  id: string;
  visible: EnableStatus;
  displayName: string;
  price: number;
};

export type NormalizedOrderItemForCreate = {
  sizeId: string | null;
  sizeDisplayName: string | null;
  sizeLengthCm: number | null;
  sizeDescription: string | null;
  sizePrice: number | null;
  flavorId: string | null;
  flavorDisplayName: string | null;
  flavorPrice: number | null;
  letteringMessage: string | null;
  requestMessage: string | null;
  quantity: number;
  itemPrice: number;
  imageUrls: string[];
};

export function parseSizeOptions(options: unknown): ParsedSizeOption[] {
  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .map((option) => {
      if (!option || typeof option !== "object") {
        return null;
      }

      const candidate = option as Record<string, unknown>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.visible !== "string" ||
        typeof candidate.displayName !== "string" ||
        typeof candidate.price !== "number"
      ) {
        return null;
      }

      const parsed: ParsedSizeOption = {
        id: candidate.id,
        visible: candidate.visible as EnableStatus,
        displayName: candidate.displayName,
        price: candidate.price,
      };
      if (typeof candidate.lengthCm === "number") {
        parsed.lengthCm = candidate.lengthCm;
      }
      if (typeof candidate.description === "string") {
        parsed.description = candidate.description;
      }
      return parsed;
    })
    .filter((option): option is ParsedSizeOption => option !== null);
}

export function parseFlavorOptions(options: unknown): ParsedFlavorOption[] {
  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .map((option) => {
      if (!option || typeof option !== "object") {
        return null;
      }

      const candidate = option as Record<string, unknown>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.visible !== "string" ||
        typeof candidate.displayName !== "string" ||
        typeof candidate.price !== "number"
      ) {
        return null;
      }

      return {
        id: candidate.id,
        visible: candidate.visible as EnableStatus,
        displayName: candidate.displayName,
        price: candidate.price,
      };
    })
    .filter((option): option is ParsedFlavorOption => option !== null);
}

export function validateAndNormalizeOrderItem(
  item: CreateOrderItemDto,
  sizeOptionMap: Map<string, ParsedSizeOption>,
  flavorOptionMap: Map<string, ParsedFlavorOption>,
  baseSalePrice: number,
): NormalizedOrderItemForCreate {
  const hasSizePayload =
    item.sizeDisplayName !== undefined ||
    item.sizeLengthCm !== undefined ||
    item.sizeDescription !== undefined ||
    item.sizePrice !== undefined;
  const hasFlavorPayload = item.flavorDisplayName !== undefined || item.flavorPrice !== undefined;

  let selectedSize: {
    id: string;
    displayName: string;
    lengthCm?: number;
    description?: string;
    price: number;
  } | null = null;

  if (item.sizeId) {
    const matchedSize = sizeOptionMap.get(item.sizeId);
    if (!matchedSize || matchedSize.visible !== EnableStatus.ENABLE) {
      LoggerUtil.log(
        `주문 항목 검증 실패: 유효하지 않은 사이즈 옵션 - sizeId: ${item.sizeId}, visible: ${matchedSize?.visible}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
    }
    selectedSize = {
      id: matchedSize.id,
      displayName: matchedSize.displayName,
      lengthCm: matchedSize.lengthCm,
      description: matchedSize.description,
      price: matchedSize.price,
    };
  } else if (hasSizePayload) {
    LoggerUtil.log(
      `주문 항목 검증 실패: sizeId 없이 사이즈 정보 제공 - hasSizePayload: ${hasSizePayload}`,
    );
    throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
  }

  let selectedFlavor: { id: string; displayName: string; price: number } | null = null;
  if (item.flavorId) {
    const matchedFlavor = flavorOptionMap.get(item.flavorId);
    if (!matchedFlavor || matchedFlavor.visible !== EnableStatus.ENABLE) {
      LoggerUtil.log(
        `주문 항목 검증 실패: 유효하지 않은 맛 옵션 - flavorId: ${item.flavorId}, visible: ${matchedFlavor?.visible}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
    }
    selectedFlavor = {
      id: matchedFlavor.id,
      displayName: matchedFlavor.displayName,
      price: matchedFlavor.price,
    };
  } else if (hasFlavorPayload) {
    LoggerUtil.log(
      `주문 항목 검증 실패: flavorId 없이 맛 정보 제공 - hasFlavorPayload: ${hasFlavorPayload}`,
    );
    throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
  }

  const itemPrice = baseSalePrice + (selectedSize?.price ?? 0) + (selectedFlavor?.price ?? 0);

  return {
    sizeId: selectedSize?.id ?? null,
    sizeDisplayName: selectedSize?.displayName ?? null,
    sizeLengthCm: selectedSize?.lengthCm ?? null,
    sizeDescription: selectedSize?.description ?? null,
    sizePrice: selectedSize?.price ?? null,
    flavorId: selectedFlavor?.id ?? null,
    flavorDisplayName: selectedFlavor?.displayName ?? null,
    flavorPrice: selectedFlavor?.price ?? null,
    letteringMessage: item.letteringMessage ?? null,
    requestMessage: item.requestMessage ?? null,
    quantity: item.quantity,
    itemPrice,
    imageUrls: item.imageUrls ?? [],
  };
}
