import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/apps/web-seller/common/components/cards/Card";
import PhoneVerificationForm from "@/apps/web-seller/features/auth/components/forms/PhoneVerificationForm";
import { PHONE_VERIFICATION_PURPOSE } from "@/apps/web-seller/features/auth/types/auth.dto";
import { useMypageChangePhone } from "@/apps/web-seller/features/mypage/hooks/mutations/useMypageMutation";

export const MypagePhoneSection: React.FC = () => {
  const changePhoneMutation = useMypageChangePhone();
  const [phoneFormKey, setPhoneFormKey] = useState(0);

  const handleVerifiedNewPhone = async (normalizedPhone: string) => {
    await changePhoneMutation.mutateAsync({ newPhone: normalizedPhone });
    setPhoneFormKey((k) => k + 1);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">휴대폰 번호 변경</CardTitle>
      </CardHeader>
      <CardContent>
        <PhoneVerificationForm
          key={phoneFormKey}
          purpose={PHONE_VERIFICATION_PURPOSE.PHONE_CHANGE}
          onVerificationComplete={handleVerifiedNewPhone}
        />
      </CardContent>
    </Card>
  );
};
