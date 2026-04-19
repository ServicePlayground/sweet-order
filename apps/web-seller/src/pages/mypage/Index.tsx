import React from "react";
import { Loader2 } from "lucide-react";
import { useMypageProfile } from "@/apps/web-seller/features/mypage/hooks/queries/useMypageProfileQuery";
import { MypageProfileSection } from "@/apps/web-seller/features/mypage/components/MypageProfileSection";
import { MypagePhoneSection } from "@/apps/web-seller/features/mypage/components/MypagePhoneSection";

/**
 * 판매자 계정 마이페이지
 */
export const MypageIndexPage: React.FC = () => {
  const { data: profile, isLoading } = useMypageProfile();

  if (isLoading || !profile) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        마이페이지를 불러오는 중…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">마이페이지</h1>
      </div>

      <MypageProfileSection profile={profile} />
      <MypagePhoneSection />
    </div>
  );
};
