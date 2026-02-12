import React, { useState, useEffect } from "react";
import {
  IProductForm,
  EnableStatus,
  CakeSizeOption,
  CakeFlavorOption,
  CakeSizeDisplayName,
} from "@/apps/web-seller/features/product/types/product.type";
import {
  CAKE_SIZE_DISPLAY_NAME_OPTIONS,
  VISIBILITY_STATUS_OPTIONS,
} from "@/apps/web-seller/features/product/constants/product.constant";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/apps/web-seller/common/components/@shadcn-ui/select";
import { Input } from "@/apps/web-seller/common/components/@shadcn-ui/input";
import { Label } from "@/apps/web-seller/common/components/@shadcn-ui/label";
import { Card, CardContent } from "@/apps/web-seller/common/components/@shadcn-ui/card";
import { Trash2, Plus } from "lucide-react";

export interface ProductCreationCakeOptionsSectionProps {
  form: IProductForm;
  errors: Partial<Record<keyof IProductForm, string>>;
  onCakeSizeOptionsChange: (options: CakeSizeOption[]) => void;
  onCakeFlavorOptionsChange: (options: CakeFlavorOption[]) => void;
}

// 상품 등록 폼 - 케이크 옵션 섹션
export const ProductCreationCakeOptionsSection: React.FC<
  ProductCreationCakeOptionsSectionProps
> = ({ form, onCakeSizeOptionsChange, onCakeFlavorOptionsChange }) => {
  const [sizeOptions, setSizeOptions] = useState<CakeSizeOption[]>(form.cakeSizeOptions || []);
  const [flavorOptions, setFlavorOptions] = useState<CakeFlavorOption[]>(
    form.cakeFlavorOptions || [],
  );

  // form 변경 시 state 동기화
  useEffect(() => {
    setSizeOptions(form.cakeSizeOptions || []);
    setFlavorOptions(form.cakeFlavorOptions || []);
  }, [form.cakeSizeOptions, form.cakeFlavorOptions]);

  // 사이즈 옵션 추가
  const handleAddSizeOption = () => {
    const newOption: CakeSizeOption = {
      visible: EnableStatus.ENABLE,
      displayName: CakeSizeDisplayName.DOSIRAK,
      lengthCm: 0,
      price: 0,
      description: "",
    };
    const updated = [...sizeOptions, newOption];
    setSizeOptions(updated);
    onCakeSizeOptionsChange(updated);
  };

  // 사이즈 옵션 삭제
  const handleRemoveSizeOption = (index: number) => {
    const updated = sizeOptions.filter((_, i) => i !== index);
    setSizeOptions(updated);
    onCakeSizeOptionsChange(updated);
  };

  // 사이즈 옵션 변경
  const handleSizeOptionChange = (
    index: number,
    field: keyof CakeSizeOption,
    value: string | EnableStatus | number | CakeSizeDisplayName,
  ) => {
    const updated = sizeOptions.map((option, i) =>
      i === index ? { ...option, [field]: value } : option,
    );
    setSizeOptions(updated);
    onCakeSizeOptionsChange(updated);
  };

  // 맛 옵션 추가
  const handleAddFlavorOption = () => {
    const newOption: CakeFlavorOption = {
      visible: EnableStatus.ENABLE,
      displayName: "",
      price: 0,
    };
    const updated = [...flavorOptions, newOption];
    setFlavorOptions(updated);
    onCakeFlavorOptionsChange(updated);
  };

  // 맛 옵션 삭제
  const handleRemoveFlavorOption = (index: number) => {
    const updated = flavorOptions.filter((_, i) => i !== index);
    setFlavorOptions(updated);
    onCakeFlavorOptionsChange(updated);
  };

  // 맛 옵션 변경
  const handleFlavorOptionChange = (
    index: number,
    field: keyof CakeFlavorOption,
    value: string | EnableStatus | number,
  ) => {
    const updated = flavorOptions.map((option, i) =>
      i === index ? { ...option, [field]: value } : option,
    );
    setFlavorOptions(updated);
    onCakeFlavorOptionsChange(updated);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-2">케이크 옵션</h2>
        <div className="border-t mb-6" />

        <div className="space-y-8">
          {/* 사이즈 목록 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-medium">사이즈 목록</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSizeOption}>
                <Plus className="h-4 w-4 mr-1" />
                추가
              </Button>
            </div>

            {sizeOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                사이즈 옵션이 없습니다. 추가 버튼을 클릭하여 추가하세요.
              </p>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">사용 여부</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        표시명 <span className="text-destructive">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        길이 (cm) <span className="text-destructive">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        가격 <span className="text-destructive">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">설명</th>
                      <th className="px-4 py-3 text-center text-sm font-medium w-20">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeOptions.map((option, index) => (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <Select
                            value={option.visible}
                            onValueChange={(value) =>
                              handleSizeOptionChange(index, "visible", value as EnableStatus)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {VISIBILITY_STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Select
                            value={option.displayName}
                            onValueChange={(value) =>
                              handleSizeOptionChange(index, "displayName", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="사이즈를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                              {CAKE_SIZE_DISPLAY_NAME_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="예: 10"
                              value={option.lengthCm === 0 ? "" : option.lengthCm}
                              onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/[^0-9]/g, "");
                                const num = onlyDigits === "" ? 0 : parseInt(onlyDigits, 10);
                                handleSizeOptionChange(index, "lengthCm", num);
                              }}
                              className="w-full"
                            />
                            <span className="text-sm text-muted-foreground">cm</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="예: 30000"
                            value={option.price === 0 ? "" : option.price}
                            onChange={(e) => {
                              const onlyDigits = e.target.value.replace(/[^0-9]/g, "");
                              const num = onlyDigits === "" ? 0 : parseInt(onlyDigits, 10);
                              handleSizeOptionChange(index, "price", num);
                            }}
                            className="w-full"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            placeholder="예: 1~2인용"
                            value={option.description}
                            onChange={(e) =>
                              handleSizeOptionChange(index, "description", e.target.value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSizeOption(index)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 맛 목록 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-medium">맛 목록</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddFlavorOption}>
                <Plus className="h-4 w-4 mr-1" />
                추가
              </Button>
            </div>

            {flavorOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                맛 옵션이 없습니다. 추가 버튼을 클릭하여 추가하세요.
              </p>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">사용 여부</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        표시명 <span className="text-destructive">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        가격 <span className="text-destructive">*</span>
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium w-20">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flavorOptions.map((option, index) => (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <Select
                            value={option.visible}
                            onValueChange={(value) =>
                              handleFlavorOptionChange(index, "visible", value as EnableStatus)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {VISIBILITY_STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            placeholder="예: 초콜릿"
                            value={option.displayName}
                            onChange={(e) =>
                              handleFlavorOptionChange(index, "displayName", e.target.value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="예: 0"
                            value={option.price === 0 ? "" : option.price}
                            onChange={(e) => {
                              const onlyDigits = e.target.value.replace(/[^0-9]/g, "");
                              const num = onlyDigits === "" ? 0 : parseInt(onlyDigits, 10);
                              handleFlavorOptionChange(index, "price", num);
                            }}
                            className="w-full"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFlavorOption(index)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
