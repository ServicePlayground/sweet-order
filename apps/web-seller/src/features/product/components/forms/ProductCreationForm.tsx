import React, { useState, useEffect } from "react";
import { Box, Button, Tabs, Tab, Paper, Typography } from "@mui/material";
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

export const ProductCreationForm: React.FC<Props> = ({ onSubmit, initialValue, onChange }) => {
  const [form, setForm] = useState<IProductForm>(initialValue || defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof IProductForm, string>>>({});
  const [activeTab, setActiveTab] = useState(0);

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
          setActiveTab(1); // 상세정보 탭
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
          setActiveTab(2); // 상품정보제공고시 탭
        } else if (validationErrors.cancellationRefundDetailDescription) {
          setActiveTab(3); // 취소 및 환불 탭
        } else {
          setActiveTab(0); // 기본 정보 탭
        }
      }
      return;
    }

    onSubmit(form);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper sx={{ p: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="상품 등록 탭"
          variant="fullWidth"
        >
          <Tab label="기본 정보" />
          <Tab label="상세정보" />
          <Tab label="상품정보제공고시" />
          <Tab label="취소 및 환불" />
        </Tabs>

        {/* 기본 정보 탭 */}
        <TabPanel value={activeTab} index={0}>
          <ProductCreationBasicInfoSection
            form={form}
            errors={errors}
            onCategoryChange={handleCategoryChange}
            onImagesChange={handleImagesChange}
            onChange={handleChange}
          />

          {/* 커스텀 주문양식 섹션 */}
          <Paper sx={{ p: 3, mt: 4 }}>
            <ProductCreationOrderFormSchemaSection
              value={form.orderFormSchema}
              onChange={handleOrderFormSchemaChange}
            />
          </Paper>

          {/* 추가 설정 섹션 */}
          <Box sx={{ mt: 4 }}>
            <ProductCreationAdditionalSettingsSection
              form={form}
              errors={errors}
              onStockChange={handleChange("stock")}
              onStatusChange={handleStatusChange}
              onSizeRangeChange={handleSizeRangeChange}
              onDeliveryMethodChange={handleDeliveryMethodChange}
              onHashtagsChange={handleHashtagsChange}
            />
          </Box>
        </TabPanel>

        {/* 상세정보 탭 */}
        <TabPanel value={activeTab} index={1}>
          <ProductCreationDetailDescriptionSection
            form={form}
            errors={errors}
            onChange={handleDetailDescriptionChange}
          />
        </TabPanel>

        {/* 상품정보제공고시 탭 */}
        <TabPanel value={activeTab} index={2}>
          <ProductCreationProductNoticeSection
            form={form}
            errors={errors}
            onChange={handleChange}
          />
        </TabPanel>

        {/* 취소 및 환불 탭 */}
        <TabPanel value={activeTab} index={3}>
          <ProductCreationCancellationRefundSection
            form={form}
            errors={errors}
            onChange={handleCancellationRefundPolicyChange}
          />
        </TabPanel>
      </Paper>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" size="large">
          상품 등록
        </Button>
      </Box>
    </Box>
  );
};
