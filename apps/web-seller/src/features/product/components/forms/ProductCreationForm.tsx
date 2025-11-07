import React, { useState, useEffect } from "react";
import { Box, Button, Tabs, Tab, Paper, Typography } from "@mui/material";
import { IProductForm, MainCategory, SizeRange, DeliveryMethod, ProductStatus } from "@/apps/web-seller/features/product/types/product.type";
import { PRODUCT_ERROR_MESSAGES } from "@/apps/web-seller/features/product/constants/product.constant";
import { OrderFormSchemaBuilder } from "@/apps/web-seller/features/product/components/forms/OrderFormSchemaBuilder";
import { BasicInfoSection } from "@/apps/web-seller/features/product/components/forms/sections/BasicInfoSection";
import { AdditionalSettingsSection } from "@/apps/web-seller/features/product/components/forms/sections/AdditionalSettingsSection";

interface Props {
  onSubmit: (data: IProductForm) => void;
  initialValue?: IProductForm;
  onChange?: (data: IProductForm) => void;
}

export const defaultForm: IProductForm = {
  mainCategory: "",
  imageUrls: [],
  name: "",
  description: "",
  originalPrice: "",
  salePrice: "",
  notice: "",
  caution: "",
  basicIncluded: "",
  orderFormSchema: undefined,
  detailDescription: "",
  stock: "",
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
    <div role="tabpanel" hidden={value !== index} id={`product-tabpanel-${index}`} aria-labelledby={`product-tab-${index}`}>
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

  const validate = (): boolean => {
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

    if (form.originalPrice === "" || form.originalPrice === null || form.originalPrice === undefined) {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (key: keyof IProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      let next: IProductForm;

      if (key === "originalPrice" || key === "salePrice" || key === "stock") {
        const numValue = value === "" ? "" : parseInt(value, 10);
        next = { ...form, [key]: isNaN(numValue as number) ? "" : numValue };
      } else {
        next = { ...form, [key]: value };
      }

      setForm(next);
      onChange?.(next);
    };

  const handleCategoryChange = (value: MainCategory | "") => {
    const next = { ...form, mainCategory: value };
    setForm(next);
    onChange?.(next);
  };

  const handleImageUrlsChange = (urls: string[]) => {
    const next = { ...form, imageUrls: urls };
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

  const handleOrderFormSchemaChange = (schema: any) => {
    const next = { ...form, orderFormSchema: schema };
    setForm(next);
    onChange?.(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // 첫 번째 에러가 있는 탭으로 이동
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        // 기본 정보 탭으로 이동
        setActiveTab(0);
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
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="상품 등록 탭">
          <Tab label="기본 정보" />
          <Tab label="커스텀 주문양식" />
          <Tab label="상세정보" />
          <Tab label="안내/주의사항" />
        </Tabs>

        {/* 기본 정보 탭 */}
        <TabPanel value={activeTab} index={0}>
          <BasicInfoSection
            form={form}
            errors={errors}
            onCategoryChange={handleCategoryChange}
            onImageUrlsChange={handleImageUrlsChange}
            onChange={handleChange}
          />
        </TabPanel>

        {/* 커스텀 주문양식 탭 */}
        <TabPanel value={activeTab} index={1}>
          <OrderFormSchemaBuilder value={form.orderFormSchema} onChange={handleOrderFormSchemaChange} />
        </TabPanel>

        {/* 상세정보 탭 */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body1">상세정보 입력 기능은 추후 구현 예정입니다.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              HTML 편집기로 작성 가능한 상세설명 편집기가 제공됩니다.
            </Typography>
          </Box>
        </TabPanel>

        {/* 안내/주의사항 탭 */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body1">상품정보제공고시 기능은 추후 구현 예정입니다.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              식품 판매 시 법적으로 입력해야 하는 항목들이 포함됩니다.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>

      {/* 추가 설정 섹션 */}
      <AdditionalSettingsSection
        form={form}
        errors={errors}
        onStockChange={handleChange("stock")}
        onStatusChange={handleStatusChange}
        onSizeRangeChange={handleSizeRangeChange}
        onDeliveryMethodChange={handleDeliveryMethodChange}
        onHashtagsChange={handleHashtagsChange}
      />

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" size="large">
          상품 등록
        </Button>
      </Box>
    </Box>
  );
};
