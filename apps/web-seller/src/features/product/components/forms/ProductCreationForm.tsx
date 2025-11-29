import React, { useState, useEffect } from "react";
import { Button } from "@/apps/web-seller/common/components/ui/button";
import { Card, CardContent } from "@/apps/web-seller/common/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/apps/web-seller/common/components/ui/tabs";
import {
  IProductForm,
  MainCategory,
  SizeRange,
  DeliveryMethod,
  ProductStatus,
  OrderFormSchema,
} from "@/apps/web-seller/features/product/types/product.type";
import { ProductCreationOrderFormSchemaSection } from "@/apps/web-seller/features/product/components/sections/ProductCreationOrderFormSchemaSection";
import { ProductCreationBasicInfoSection } from "@/apps/web-seller/features/product/components/sections/ProductCreationBasicInfoSection";
import { ProductCreationAdditionalSettingsSection } from "@/apps/web-seller/features/product/components/sections/ProductCreationAdditionalSettingsSection";
import { ProductCreationDetailDescriptionSection } from "@/apps/web-seller/features/product/components/sections/ProductCreationDetailDescriptionSection";
import { ProductCreationCancellationRefundSection } from "@/apps/web-seller/features/product/components/sections/ProductCreationCancellationRefundSection";
import { ProductCreationProductNoticeSection } from "@/apps/web-seller/features/product/components/sections/ProductCreationProductNoticeSection";
import { validateProductForm } from "@/apps/web-seller/features/product/utils/validateProductForm";

interface Props {
  onSubmit: (data: IProductForm) => void;
  initialValue?: IProductForm;
  onChange?: (data: IProductForm) => void;
}

export const defaultForm: IProductForm = {
  mainCategory: MainCategory.CAKE,
  images: [],
  name: "",
  description: "",
  originalPrice: 0,
  salePrice: 0,
  notice: "",
  caution: "",
  basicIncluded: "",
  orderFormSchema: undefined,
  detailDescription: "",
  cancellationRefundDetailDescription: "",
  productNoticeFoodType: "",
  productNoticeProducer: "",
  productNoticeOrigin: "",
  productNoticeAddress: "",
  productNoticeManufactureDate: "",
  productNoticeExpirationDate: "",
  productNoticePackageCapacity: "",
  productNoticePackageQuantity: "",
  productNoticeIngredients: "",
  productNoticeCalories: "",
  productNoticeSafetyNotice: "",
  productNoticeGmoNotice: "",
  productNoticeImportNotice: "",
  productNoticeCustomerService: "",
  stock: 0,
  sizeRange: [],
  deliveryMethod: [],
  hashtags: [],
  status: ProductStatus.ACTIVE,
};


export const ProductCreationForm: React.FC<Props> = ({ onSubmit, initialValue, onChange }) => {
  const [form, setForm] = useState<IProductForm>(initialValue || defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof IProductForm, string>>>({});
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
      setErrors({});
    }
  }, [initialValue]);

  const validate = (): {
    isValid: boolean;
    errors: Partial<Record<keyof IProductForm, string>>;
  } => {
    const newErrors = validateProductForm(form);
    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleChange =
    (key: keyof IProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      let next: IProductForm;

      // 정가, 판매가, 재고수량은 숫자로 변환
      if (key === "originalPrice" || key === "salePrice" || key === "stock") {
        const numValue = value === "" ? 0 : parseInt(value, 10);
        next = { ...form, [key]: isNaN(numValue) ? 0 : numValue };
      } else {
        next = { ...form, [key]: value };
      }

      setForm(next);
      onChange?.(next);
    };

  const handleCategoryChange = (value: MainCategory) => {
    const next = { ...form, mainCategory: value };
    setForm(next);
    onChange?.(next);
  };

  const handleImagesChange = (urls: string[]) => {
    const next = { ...form, images: urls };
    setForm(next);
    onChange?.(next);
  };

  const handleSizeRangeChange = (values: string[]) => {
    const next = { ...form, sizeRange: values as SizeRange[] };
    setForm(next);
    onChange?.(next);
  };

  const handleDeliveryMethodChange = (values: string[]) => {
    const next = { ...form, deliveryMethod: values as DeliveryMethod[] };
    setForm(next);
    onChange?.(next);
  };

  const handleHashtagsChange = (hashtags: string[]) => {
    const next = { ...form, hashtags };
    setForm(next);
    onChange?.(next);
  };

  const handleStatusChange = (value: ProductStatus) => {
    const next = { ...form, status: value };
    setForm(next);
    onChange?.(next);
  };

  const handleOrderFormSchemaChange = (schema: OrderFormSchema) => {
    const next = { ...form, orderFormSchema: schema };
    setForm(next);
    onChange?.(next);
  };

  const handleDetailDescriptionChange = (value: string) => {
    const next = { ...form, detailDescription: value };
    setForm(next);
    onChange?.(next);
  };

  const handleCancellationRefundPolicyChange = (value: string) => {
    const next = { ...form, cancellationRefundDetailDescription: value };
    setForm(next);
    onChange?.(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validate();
    if (!isValid) {
      // 첫 번째 에러가 있는 탭으로 이동
      const errorKeys = Object.keys(validationErrors);
      if (errorKeys.length > 0) {
        // 에러가 있는 탭으로 이동
        if (validationErrors.detailDescription) {
          setActiveTab("detail"); // 상세정보 탭
        } else if (
          validationErrors.productNoticeFoodType ||
          validationErrors.productNoticeProducer ||
          validationErrors.productNoticeOrigin ||
          validationErrors.productNoticeAddress ||
          validationErrors.productNoticeManufactureDate ||
          validationErrors.productNoticeExpirationDate ||
          validationErrors.productNoticePackageCapacity ||
          validationErrors.productNoticePackageQuantity ||
          validationErrors.productNoticeIngredients ||
          validationErrors.productNoticeCalories ||
          validationErrors.productNoticeSafetyNotice ||
          validationErrors.productNoticeGmoNotice ||
          validationErrors.productNoticeImportNotice ||
          validationErrors.productNoticeCustomerService
        ) {
          setActiveTab("notice"); // 상품정보제공고시 탭
        } else if (validationErrors.cancellationRefundDetailDescription) {
          setActiveTab("refund"); // 취소 및 환불 탭
        } else {
          setActiveTab("basic"); // 기본 정보 탭
        }
      }
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">기본 정보</TabsTrigger>
              <TabsTrigger value="detail">상세정보</TabsTrigger>
              <TabsTrigger value="notice">상품정보제공고시</TabsTrigger>
              <TabsTrigger value="refund">취소 및 환불</TabsTrigger>
            </TabsList>

            {/* 기본 정보 탭 */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              <ProductCreationBasicInfoSection
                form={form}
                errors={errors}
                onCategoryChange={handleCategoryChange}
                onImagesChange={handleImagesChange}
                onChange={handleChange}
              />

              {/* 커스텀 주문양식 섹션 */}
              <Card>
                <CardContent className="p-6">
                  <ProductCreationOrderFormSchemaSection
                    value={form.orderFormSchema}
                    onChange={handleOrderFormSchemaChange}
                  />
                </CardContent>
              </Card>

              {/* 추가 설정 섹션 */}
              <div>
                <ProductCreationAdditionalSettingsSection
                  form={form}
                  errors={errors}
                  onStockChange={handleChange("stock")}
                  onStatusChange={handleStatusChange}
                  onSizeRangeChange={handleSizeRangeChange}
                  onDeliveryMethodChange={handleDeliveryMethodChange}
                  onHashtagsChange={handleHashtagsChange}
                />
              </div>
            </TabsContent>

            {/* 상세정보 탭 */}
            <TabsContent value="detail" className="mt-6">
              <ProductCreationDetailDescriptionSection
                form={form}
                errors={errors}
                onChange={handleDetailDescriptionChange}
              />
            </TabsContent>

            {/* 상품정보제공고시 탭 */}
            <TabsContent value="notice" className="mt-6">
              <ProductCreationProductNoticeSection
                form={form}
                errors={errors}
                onChange={handleChange}
              />
            </TabsContent>

            {/* 취소 및 환불 탭 */}
            <TabsContent value="refund" className="mt-6">
              <ProductCreationCancellationRefundSection
                form={form}
                errors={errors}
                onChange={handleCancellationRefundPolicyChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          상품 등록
        </Button>
      </div>
    </form>
  );
};
