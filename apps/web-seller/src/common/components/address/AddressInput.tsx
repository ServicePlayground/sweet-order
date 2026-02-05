import React, { useState, useEffect } from "react";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";
import { Input } from "@/apps/web-seller/common/components/@shadcn-ui/input";
import { Label } from "@/apps/web-seller/common/components/@shadcn-ui/label";
import { openAddressSearch } from "@/apps/web-seller/common/utils/kakao-address.util";
import { IStoreAddress } from "@/apps/web-seller/features/store/types/store.type";

interface AddressInputProps {
  required?: boolean;
  value: IStoreAddress;
  onChange: (data: IStoreAddress) => void;
  error?: string;
}

/**
 * 카카오 주소 검색을 사용하는 주소 입력 컴포넌트
 * Daum 우편번호 서비스를 사용하여 주소를 검색하고 선택할 수 있습니다.
 */
export const AddressInput: React.FC<AddressInputProps> = ({
  required = true,
  value,
  onChange,
  error,
}) => {
  const [displayAddress, setDisplayAddress] = useState<string>("");

  useEffect(() => {
    // 도로명 주소가 있으면 도로명 주소를, 없으면 지번 주소를 표시
    setDisplayAddress(value.roadAddress || value.address || "");
  }, [value]);

  const handleAddressSearch = async () => {
    await openAddressSearch((data: IStoreAddress) => {
      onChange({
        address: data.address,
        roadAddress: data.roadAddress,
        zonecode: data.zonecode,
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });
  };

  return (
    <div className="space-y-2">
      <Label className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
        스토어 주소
      </Label>
      <div className="flex gap-2">
        <Input
          placeholder="주소 검색 버튼을 클릭하여 주소를 선택하세요"
          value={displayAddress}
          readOnly
          className={error ? "border-destructive" : ""}
        />
        <Button type="button" variant="outline" onClick={handleAddressSearch}>
          주소 검색
        </Button>
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};
