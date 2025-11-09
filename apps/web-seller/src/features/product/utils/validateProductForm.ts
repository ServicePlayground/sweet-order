import { IProductForm } from "@/apps/web-seller/features/product/types/product.type";
import { PRODUCT_ERROR_MESSAGES } from "@/apps/web-seller/features/product/constants/product.constant";

export const validateProductForm = (
  form: IProductForm,
): Partial<Record<keyof IProductForm, string>> => {
  const newErrors: Partial<Record<keyof IProductForm, string>> = {};

  // 기본 정보 검증
  if (!form.mainCategory) {
    newErrors.mainCategory = PRODUCT_ERROR_MESSAGES.MAIN_CATEGORY_REQUIRED;
  }

  if (form.imageUrls.length === 0) {
    newErrors.imageUrls = PRODUCT_ERROR_MESSAGES.IMAGE_URLS_REQUIRED;
  }

  if (!form.name.trim()) {
    newErrors.name = PRODUCT_ERROR_MESSAGES.NAME_REQUIRED;
  }

  if (
    form.originalPrice === "" ||
    form.originalPrice === null ||
    form.originalPrice === undefined
  ) {
    newErrors.originalPrice = PRODUCT_ERROR_MESSAGES.ORIGINAL_PRICE_REQUIRED;
  } else if (typeof form.originalPrice === "number" && form.originalPrice <= 0) {
    newErrors.originalPrice = PRODUCT_ERROR_MESSAGES.ORIGINAL_PRICE_INVALID;
  }

  if (form.salePrice === "" || form.salePrice === null || form.salePrice === undefined) {
    newErrors.salePrice = PRODUCT_ERROR_MESSAGES.SALE_PRICE_REQUIRED;
  } else if (typeof form.salePrice === "number" && form.salePrice <= 0) {
    newErrors.salePrice = PRODUCT_ERROR_MESSAGES.SALE_PRICE_INVALID;
  }

  if (
    typeof form.originalPrice === "number" &&
    typeof form.salePrice === "number" &&
    form.salePrice > form.originalPrice
  ) {
    newErrors.salePrice = PRODUCT_ERROR_MESSAGES.SALE_PRICE_HIGHER_THAN_ORIGINAL;
  }

  // 보이지 않는 부분 검증
  if (form.stock === "" || form.stock === null || form.stock === undefined) {
    newErrors.stock = PRODUCT_ERROR_MESSAGES.STOCK_REQUIRED;
  } else if (typeof form.stock === "number" && form.stock < 1) {
    newErrors.stock = PRODUCT_ERROR_MESSAGES.STOCK_INVALID;
  }

  if (form.sizeRange.length === 0) {
    newErrors.sizeRange = PRODUCT_ERROR_MESSAGES.SIZE_RANGE_REQUIRED;
  }

  if (form.deliveryMethod.length === 0) {
    newErrors.deliveryMethod = PRODUCT_ERROR_MESSAGES.DELIVERY_METHOD_REQUIRED;
  }

  if (form.hashtags.length > 10) {
    newErrors.hashtags = PRODUCT_ERROR_MESSAGES.HASHTAG_MAX;
  }

  // 상품정보제공고시 검증
  if (!form.productNoticeFoodType?.trim()) {
    newErrors.productNoticeFoodType = PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_FOOD_TYPE_REQUIRED;
  }

  if (!form.productNoticeProducer?.trim()) {
    newErrors.productNoticeProducer = PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_PRODUCER_REQUIRED;
  }

  if (!form.productNoticeOrigin?.trim()) {
    newErrors.productNoticeOrigin = PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_ORIGIN_REQUIRED;
  }

  if (!form.productNoticeAddress?.trim()) {
    newErrors.productNoticeAddress = PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_ADDRESS_REQUIRED;
  }

  if (!form.productNoticeManufactureDate?.trim()) {
    newErrors.productNoticeManufactureDate =
      PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_MANUFACTURE_DATE_REQUIRED;
  }

  if (!form.productNoticeExpirationDate?.trim()) {
    newErrors.productNoticeExpirationDate =
      PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_EXPIRATION_DATE_REQUIRED;
  }

  if (!form.productNoticePackageCapacity?.trim()) {
    newErrors.productNoticePackageCapacity =
      PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_PACKAGE_CAPACITY_REQUIRED;
  }

  if (!form.productNoticePackageQuantity?.trim()) {
    newErrors.productNoticePackageQuantity =
      PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_PACKAGE_QUANTITY_REQUIRED;
  }

  if (!form.productNoticeIngredients?.trim()) {
    newErrors.productNoticeIngredients = PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_INGREDIENTS_REQUIRED;
  }

  if (!form.productNoticeCalories?.trim()) {
    newErrors.productNoticeCalories = PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_CALORIES_REQUIRED;
  }

  if (!form.productNoticeSafetyNotice?.trim()) {
    newErrors.productNoticeSafetyNotice =
      PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_SAFETY_NOTICE_REQUIRED;
  }

  if (!form.productNoticeGmoNotice?.trim()) {
    newErrors.productNoticeGmoNotice = PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_GMO_NOTICE_REQUIRED;
  }

  if (!form.productNoticeImportNotice?.trim()) {
    newErrors.productNoticeImportNotice =
      PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_IMPORT_NOTICE_REQUIRED;
  }

  if (!form.productNoticeCustomerService?.trim()) {
    newErrors.productNoticeCustomerService =
      PRODUCT_ERROR_MESSAGES.PRODUCT_NOTICE_CUSTOMER_SERVICE_REQUIRED;
  }

  return newErrors;
};
