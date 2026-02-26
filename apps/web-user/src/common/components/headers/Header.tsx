"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/apps/web-user/common/components/icons";
import { useUserCurrentLocationStore } from "@/apps/web-user/common/store/user-current-location.store";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { useHeaderStore } from "@/apps/web-user/common/store/header.store";
import { useStoreRegions } from "@/apps/web-user/features/store/hooks/queries/useStoreRegions";
import {
  matchAddressToRegion,
  findNearestActiveRegion,
  RegionMatchResult,
} from "@/apps/web-user/common/utils/region-match.util";
import { Modal } from "@/apps/web-user/common/components/modals/Modal";
import { Toast } from "@/apps/web-user/common/components/toast/Toast";
import { RegionSelectSheet } from "@/apps/web-user/common/components/headers/RegionSelectSheet";

const REGION_STORAGE_KEY = "sweet-order:selected-region";

interface HeaderProps {
  variant?: "main" | "product" | "minimal" | "search" | "back-title";
  title?: string;
}

export default function Header({ variant = "main", title }: HeaderProps) {
  const router = useRouter();
  const { address, latitude, longitude, setAddress } = useUserCurrentLocationStore();
  const { isHomeSearchVisible } = useHeaderStore();
  const { data: regionsData } = useStoreRegions();

  const [overrideResult, setOverrideResult] = useState<RegionMatchResult | null>(null);
  const [showOpenAlarmToast, setShowOpenAlarmToast] = useState(false);
  const [showRegionSheet, setShowRegionSheet] = useState(false);
  const [inactiveModal, setInactiveModal] = useState<{
    visible: boolean;
    type: "seoul" | "outside";
    currentLabel: string;
    nearest: RegionMatchResult | null;
  }>({ visible: false, type: "seoul", currentLabel: "", nearest: null });

  const matchResult = useMemo(() => {
    if (!address || !regionsData?.regions) return null;
    return matchAddressToRegion(address, regionsData.regions);
  }, [address, regionsData]);

  // 최초 진입 시 localStorage에서 지역 복원
  useEffect(() => {
    const stored = localStorage.getItem(REGION_STORAGE_KEY);
    if (stored) {
      try {
        setOverrideResult(JSON.parse(stored));
      } catch {
        localStorage.removeItem(REGION_STORAGE_KEY);
      }
    }
  }, []);

  // overrideResult 변경 시 localStorage 저장
  useEffect(() => {
    if (overrideResult) {
      localStorage.setItem(REGION_STORAGE_KEY, JSON.stringify(overrideResult));
    }
  }, [overrideResult]);

  // GPS로 활성 지역 확정 시 localStorage 저장 (overrideResult 없을 때만)
  useEffect(() => {
    if (matchResult && matchResult.storeCount > 0 && !overrideResult) {
      localStorage.setItem(REGION_STORAGE_KEY, JSON.stringify(matchResult));
    }
  }, [matchResult, overrideResult]);

  // 비활성 지역 감지 시 모달 표시 (저장된 지역이 있으면 스킵)
  useEffect(() => {
    if (!matchResult || !regionsData?.regions) return;
    if (overrideResult) return;
    if (matchResult.storeCount === 0) {
      const isSeoul = matchResult.depth1Label === "서울";
      if (isSeoul) {
        const nearest = findNearestActiveRegion(regionsData.regions, matchResult.depth1Label, latitude, longitude);
        setInactiveModal({ visible: true, type: "seoul", currentLabel: matchResult.label, nearest });
      } else {
        setInactiveModal({ visible: true, type: "outside", currentLabel: matchResult.depth1Label, nearest: null });
      }
    }
  }, [matchResult, regionsData, overrideResult]);

  const displayAddress = overrideResult?.label ?? matchResult?.label ?? address ?? null;

  // 배경 클릭 비활성화
  const handleInactiveClose = () => {};

  // 근처매장보기: 가장 가까운 활성 지역으로 override
  const handleInactiveConfirm = () => {
    if (inactiveModal.nearest) {
      setOverrideResult(inactiveModal.nearest);
    }
    setInactiveModal((prev) => ({ ...prev, visible: false }));
  };

  // 취소: 강남구(디폴트)로 리셋
  const handleInactiveCancel = () => {
    setAddress("서울특별시 강남구");
    setOverrideResult(null);
    setInactiveModal((prev) => ({ ...prev, visible: false }));
  };

  // 우리 동네 오픈알림 (서울 외 지역)
  const handleOutsideConfirm = () => {
    // TODO: 오픈 알림 등록 로직
    setInactiveModal((prev) => ({ ...prev, visible: false }));
    setTimeout(() => setShowOpenAlarmToast(true), 500);
  };

  // 장바구니 버튼 컴포넌트 (공통)
  const CartButton = () => (
    <div
      className="relative flex items-center justify-center rounded-lg text-gray-900"
      aria-label="장바구니"
    >
      <Icon name="cart" width={24} height={24} />
    </div>
  );

  // 알람 버튼 컴포넌트 (공통)
  const AlarmButton = () => (
    <Link
      href={PATHS.ALARM}
      className="relative flex items-center justify-center rounded-lg text-gray-900"
      aria-label="알람"
    >
      <Icon name="alarm" width={24} height={24} />
    </Link>
  );

  const LocationButton = () => (
    <button
      type="button"
      onClick={() => setShowRegionSheet(true)}
      className="flex items-center justify-center"
    >
      <Icon name="location" width={20} height={20} className="text-primary" />
      <span className="font-bold text-gray-900 ml-1">{displayAddress ?? "위치를 불러오는 중..."}</span>
      <Icon name="arrow" width={20} height={20} className="text-gray-900 rotate-180" />
    </button>
  );

  // 뒤로가기 + 타이틀
  if (variant === "back-title") {
    return (
      <header className="sticky top-0 z-50 bg-white px-5 relative flex items-center justify-center h-[52px]">
        <button
          onClick={() => router.back()}
          className="absolute left-5 flex items-center justify-center rounded-lg border-none bg-transparent text-gray-900 cursor-pointer"
          aria-label="뒤로가기"
        >
          <Icon name="chevronLeft" width={24} height={24} className="text-gray-900" />
        </button>
        {title && <h1 className="text-sm font-bold text-gray-900">{title}</h1>}
      </header>
    );
  }

  // 뒤로가기 + 장바구니
  if (variant === "product") {
    return (
      <header className="sticky top-0 z-50 bg-white px-5 flex justify-between items-center h-[52px]">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-lg border-none bg-transparent text-gray-900 cursor-pointer"
          aria-label="뒤로가기"
        >
          <Icon name="chevronLeft" width={24} height={24} className="text-gray-900" />
        </button>
        <CartButton />
      </header>
    );
  }

  // 헤더 없음
  if (variant === "minimal") {
    return null;
  }

  // 위치 + 알람 + 취소
  if (variant === "search") {
    return (
      <header className="sticky top-0 left-0 right-0 z-50 bg-white max-w-[638px] mx-auto px-5 flex justify-between items-center h-[46px]">
        <LocationButton />
        <button
          onClick={() => router.push(PATHS.HOME)}
          className="text-sm font-bold text-gray-500 underline"
        >
          취소
        </button>
      </header>
    );
  }

  // 위치 + 알람
  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-white max-w-[638px] mx-auto px-5 flex justify-between items-center h-[52px]">
        {/* 위치 */}
        <LocationButton />

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-4">
          <Link
            href={PATHS.QA}
            className="px-3 py-1.5 text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-lg"
          >
            QA
          </Link>
          {/* TODO: 테스트용 - 추후 제거 */}
          <button
            type="button"
            onClick={() => setAddress("부산광역시 해운대구")}
            className="px-3 py-1.5 text-xs font-bold text-blue-400 bg-blue-400/10 border border-blue-400/30 rounded-lg"
          >
            부산테스트
          </button>
          {!isHomeSearchVisible && (
            <button
              onClick={() => router.push(PATHS.SEARCH)}
              className="h-6 w-6 flex items-center justify-center"
            >
              <Icon name="search" width={24} height={24} />
            </button>
          )}
          <AlarmButton />
        </div>
      </header>

      {/* 비활성 지역 모달 (서울 내) */}
      <Modal
        isOpen={inactiveModal.visible && inactiveModal.type === "seoul"}
        onClose={handleInactiveClose}
        title={`아직 ${inactiveModal.currentLabel} 매장은 준비중입니다. 가까운 동네에서 픽업해보시겠어요?`}
        confirmText="근처매장보기"
        confirmVariant="primary"
        cancelText="취소"
        cancelVariant="outline"
        onConfirm={handleInactiveConfirm}
        onCancel={handleInactiveCancel}
      />

      {/* 비활성 지역 모달 (서울 외) */}
      <Modal
        isOpen={inactiveModal.visible && inactiveModal.type === "outside"}
        onClose={handleInactiveClose}
        title={`아직 ${inactiveModal.currentLabel}까지는 달려가는중이에요! 오픈 알람할때 가장 먼저 알려드릴까요?`}
        confirmText="우리 동네 오픈알림"
        confirmVariant="primary"
        cancelText="취소"
        cancelVariant="outline"
        onConfirm={handleOutsideConfirm}
        onCancel={handleInactiveCancel}
        confirmFlex={7}
        cancelFlex={3}
      />

      {/* 지역 선택 시트 */}
      {regionsData?.regions && (
        <RegionSelectSheet
          isOpen={showRegionSheet}
          onClose={() => setShowRegionSheet(false)}
          regions={regionsData.regions}
          currentResult={overrideResult ?? matchResult}
          onSelect={(result) => setOverrideResult(result)}
        />
      )}

      {showOpenAlarmToast && (
        <Toast
          message="오픈시 알람을 보내드릴게요!"
          iconName="checkCircle"
          iconClassName="text-green-400"
          onClose={() => setShowOpenAlarmToast(false)}
        />
      )}
    </>
  );
}
