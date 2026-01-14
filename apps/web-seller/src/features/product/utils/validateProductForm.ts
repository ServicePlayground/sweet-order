import { IProductForm } from "@/apps/web-seller/features/product/types/product.type";
import { PRODUCT_ERROR_MESSAGES } from "@/apps/web-seller/features/product/constants/product.constant";

export const validateProductForm = (
  form: IProductForm,
): Partial<Record<keyof IProductForm, string>> => {
  const newErrors: Partial<Record<keyof IProductForm, string>> = {};

  // 기본 정보 검증
  if (!form.images || form.images.length === 0 || !form.images[0]?.trim()) {
    newErrors.images = PRODUCT_ERROR_MESSAGES.MAIN_IMAGE_REQUIRED;
  }

  if (!form.name.trim()) {
    newErrors.name = PRODUCT_ERROR_MESSAGES.NAME_REQUIRED;
  }

  if (!form.salesStatus) {
    newErrors.salesStatus = PRODUCT_ERROR_MESSAGES.SALES_STATUS_REQUIRED;
  }

  if (!form.visibilityStatus) {
    newErrors.visibilityStatus = PRODUCT_ERROR_MESSAGES.VISIBILITY_STATUS_REQUIRED;
  }

  if (form.salePrice === null || form.salePrice === undefined) {
    newErrors.salePrice = PRODUCT_ERROR_MESSAGES.SALE_PRICE_REQUIRED;
  } else if (form.salePrice <= 0) {
    newErrors.salePrice = PRODUCT_ERROR_MESSAGES.SALE_PRICE_INVALID;
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
