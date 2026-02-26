"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { Modal } from "@/apps/web-user/common/components/modals/Modal";
import { Toast } from "@/apps/web-user/common/components/toast/Toast";
import {
  matchAddressToRegion,
  findNearestActiveRegion,
  RegionMatchResult,
} from "@/apps/web-user/common/utils/region-match.util";
import { RegionData } from "@/apps/web-user/features/store/types/region.type";
import { useUserCurrentLocationStore } from "@/apps/web-user/common/store/user-current-location.store";
import { requestLocationFromWebView, isWebViewEnvironment } from "@/apps/web-user/common/utils/webview.bridge";
import { reverseGeocode } from "@/apps/web-user/common/utils/kakao-geocode.util";

interface RegionSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  regions: RegionData[];
  currentResult: RegionMatchResult | null;
  onSelect: (result: RegionMatchResult) => void;
}

export function RegionSelectSheet({
  isOpen,
  onClose,
  regions,
  currentResult,
  onSelect,
}: RegionSelectSheetProps) {
  const { address, latitude, longitude, setLocation, setAddress } = useUserCurrentLocationStore();
  const [isWaitingForLocation, setIsWaitingForLocation] = useState(false);
  const [showOpenAlarmToast, setShowOpenAlarmToast] = useState(false);
  const [inactiveModal, setInactiveModal] = useState<{
    visible: boolean;
    type: "seoul" | "outside";
    currentLabel: string;
    nearest: RegionMatchResult | null;
  }>({ visible: false, type: "seoul", currentLabel: "", nearest: null });

  const listableRegions = regions.filter((r) => {
    if (r.depth1.label === "전국") return false;
    return r.depth2.some((d) => d.label !== "전지역" && d.storeCount > 0);
  });

  const [selectedDepth1, setSelectedDepth1] = useState(
    currentResult?.depth1Label ?? listableRegions[0]?.depth1.label ?? ""
  );
  const [checkedLabels, setCheckedLabels] = useState<Set<string>>(new Set());

  // 시트가 열릴 때 초기 상태 세팅
  useEffect(() => {
    if (!isOpen) return;
    const initialDepth1 = currentResult?.depth1Label ?? listableRegions[0]?.depth1.label ?? "";
    setSelectedDepth1(initialDepth1);

    const region = listableRegions.find((r) => r.depth1.label === initialDepth1);
    const activeItems = region?.depth2.filter((d) => d.label !== "전지역" && d.storeCount > 0) ?? [];

    if (currentResult?.depth1Label === initialDepth1) {
      if (currentResult.label === currentResult.depth1Label) {
        setCheckedLabels(new Set(activeItems.map((d) => d.label)));
      } else {
        setCheckedLabels(new Set([currentResult.label]));
      }
    } else {
      setCheckedLabels(new Set());
    }
  }, [isOpen]);

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // 위치 대기 중 address가 업데이트되면 자동으로 매칭 처리
  useEffect(() => {
    if (!isWaitingForLocation || !address) return;
    setIsWaitingForLocation(false);
    processMatchResult(matchAddressToRegion(address, regions));
  }, [address, isWaitingForLocation]);

  // 매칭 결과 처리
  // - 활성 지역: onSelect 후 시트 닫기
  // - 비활성 지역: 시트를 먼저 닫고 모달 표시 (z-index 충돌 방지)
  const processMatchResult = (result: RegionMatchResult | null) => {
    if (!result) {
      onClose();
      return;
    }
    if (result.storeCount > 0) {
      onSelect(result);
      onClose();
      return;
    }
    onClose(); // 시트 먼저 닫기
    const isSeoul = result.depth1Label === "서울";
    if (isSeoul) {
      const nearest = findNearestActiveRegion(regions, result.depth1Label, latitude, longitude);
      setInactiveModal({ visible: true, type: "seoul", currentLabel: result.label, nearest });
    } else {
      setInactiveModal({ visible: true, type: "outside", currentLabel: result.depth1Label, nearest: null });
    }
  };

  const getActiveItems = (depth1Label: string) => {
    const region = listableRegions.find((r) => r.depth1.label === depth1Label);
    return region?.depth2.filter((d) => d.label !== "전지역" && d.storeCount > 0) ?? [];
  };

  const currentActiveItems = getActiveItems(selectedDepth1);
  const show전지역 = currentActiveItems.length >= 3;
  const isAllChecked =
    currentActiveItems.length > 0 && checkedLabels.size === currentActiveItems.length;

  const handleDepth1Change = (depth1Label: string) => {
    setSelectedDepth1(depth1Label);
    setCheckedLabels(new Set());
  };

  const handle전지역Toggle = () => {
    if (isAllChecked) {
      setCheckedLabels(new Set());
    } else {
      setCheckedLabels(new Set(currentActiveItems.map((d) => d.label)));
    }
  };

  const handleDepth2Toggle = (label: string) => {
    setCheckedLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleSetCurrentLocation = () => {
    // 캐시된 address 무시 - 항상 신선한 GPS 요청
    setIsWaitingForLocation(true);
    if (isWebViewEnvironment()) {
      requestLocationFromWebView();
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(latitude, longitude);
          const addr = await reverseGeocode(latitude, longitude);
          if (addr) {
            setAddress(addr);
          } else {
            setIsWaitingForLocation(false);
          }
        },
        () => setIsWaitingForLocation(false),
      );
    } else {
      setIsWaitingForLocation(false);
    }
  };

  const handleConfirm = () => {
    if (checkedLabels.size === 0) {
      onClose();
      return;
    }
    if (isAllChecked) {
      const totalStoreCount = currentActiveItems.reduce((sum, d) => sum + d.storeCount, 0);
      onSelect({ label: selectedDepth1, storeCount: totalStoreCount, depth1Label: selectedDepth1 });
    } else if (checkedLabels.size === 1) {
      const label = Array.from(checkedLabels)[0];
      const item = currentActiveItems.find((d) => d.label === label)!;
      onSelect({ label: item.label, storeCount: item.storeCount, depth1Label: selectedDepth1 });
    } else {
      const selectedItems = currentActiveItems.filter((d) => checkedLabels.has(d.label));
      const totalStoreCount = selectedItems.reduce((sum, d) => sum + d.storeCount, 0);
      onSelect({
        label: `${selectedItems[0].label} 외 ${selectedItems.length - 1}개`,
        storeCount: totalStoreCount,
        depth1Label: selectedDepth1,
      });
    }
    onClose();
  };

  const handleInactiveClose = () => {};

  const handleInactiveConfirm = () => {
    if (inactiveModal.nearest) {
      onSelect(inactiveModal.nearest);
    }
    setInactiveModal((prev) => ({ ...prev, visible: false }));
  };

  const handleInactiveCancel = () => {
    setInactiveModal((prev) => ({ ...prev, visible: false }));
  };

  const handleOutsideConfirm = () => {
    setInactiveModal((prev) => ({ ...prev, visible: false }));
    setTimeout(() => setShowOpenAlarmToast(true), 500);
  };

  // 시트도 닫혀있고 모달/토스트도 없으면 아무것도 렌더링 안 함
  if (!isOpen && !inactiveModal.visible && !showOpenAlarmToast) return null;

  return (
    <>
      {/* 지역 선택 시트 */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-white max-w-[638px] mx-auto">
          {/* 헤더 */}
          <div className="h-[52px] border-b border-gray-100 shrink-0 flex items-center justify-between px-5">
            <h2 className="text-base font-bold text-gray-900">지역 설정</h2>
            <button
              type="button"
              onClick={handleSetCurrentLocation}
              disabled={isWaitingForLocation}
              className="text-sm font-medium text-primary disabled:text-gray-400"
            >
              {isWaitingForLocation ? "위치 확인 중..." : "현재 위치로 설정"}
            </button>
          </div>

          {/* 본문 */}
          <div className="flex flex-1 overflow-hidden">
            {/* 좌측: depth1 목록 */}
            <div className="w-[110px] shrink-0 border-r border-gray-100 overflow-y-auto bg-gray-50">
              {listableRegions.map((region) => {
                const isSelected = region.depth1.label === selectedDepth1;
                const activeCount = getActiveItems(region.depth1.label).length;
                const showAll = isSelected && isAllChecked;

                return (
                  <button
                    key={region.depth1.label}
                    type="button"
                    onClick={() => handleDepth1Change(region.depth1.label)}
                    className={clsx(
                      "w-full px-4 py-[14px] text-sm text-left transition-colors flex items-center justify-between gap-1",
                      isSelected
                        ? "bg-white text-gray-900 font-bold border-l-2 border-primary"
                        : "text-gray-500 font-medium"
                    )}
                  >
                    <span className="truncate">{region.depth1.label}</span>
                    <span className={clsx("text-xs shrink-0", isSelected ? "text-primary" : "text-gray-400")}>
                      {showAll ? "ALL" : activeCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 우측: depth2 목록 */}
            <div className="flex-1 overflow-y-auto">
              {show전지역 && (
                <button
                  type="button"
                  onClick={handle전지역Toggle}
                  className={clsx(
                    "w-full flex items-center justify-between px-5 py-[14px] text-sm transition-colors",
                    isAllChecked
                      ? "text-primary font-bold bg-primary/5"
                      : "text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <span>전지역</span>
                  {isAllChecked && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </button>
              )}

              {currentActiveItems.map((item) => {
                const isChecked = checkedLabels.has(item.label);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleDepth2Toggle(item.label)}
                    className={clsx(
                      "w-full flex items-center justify-between px-5 py-[14px] text-sm text-left transition-colors",
                      isChecked
                        ? "text-primary font-bold bg-primary/5"
                        : "text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <span>{item.label}</span>
                    {isChecked && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 푸터 */}
          <div className="shrink-0 px-5 py-4 border-t border-gray-100 flex gap-2">
            <span style={{ flex: 3 }}>
              <Button variant="outline" onClick={() => setCheckedLabels(new Set())}>
                초기화
              </Button>
            </span>
            <span style={{ flex: 7 }}>
              <Button variant="primary" onClick={handleConfirm} disabled={checkedLabels.size === 0}>
                선택완료
              </Button>
            </span>
          </div>
        </div>
      )}

      {/* 비활성 지역 모달 (서울 내) - 시트가 닫힌 뒤 렌더링되어 z-index 충돌 없음 */}
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
