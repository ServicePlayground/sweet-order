"use client";

import { create } from "zustand";
import { RegionMatchResult } from "@/apps/web-user/common/utils/region-match.util";

interface UserCurrentLocationState {
  // 상태
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  selectedRegion: RegionMatchResult | null;

  // 액션
  setLocation: (latitude: number, longitude: number) => void;
  setAddress: (address: string) => void;
  setSelectedRegion: (region: RegionMatchResult | null) => void;
  clearLocation: () => void;
}

export const useUserCurrentLocationStore = create<UserCurrentLocationState>()((set) => ({
  // 초기 상태
  latitude: null,
  longitude: null,
  address: null,
  selectedRegion: null,

  // 위치 설정
  setLocation: (latitude: number, longitude: number) => {
    set({ latitude, longitude });
  },

  // 주소 설정
  setAddress: (address: string) => {
    set({ address });
  },

  // 선택 지역 설정
  setSelectedRegion: (region: RegionMatchResult | null) => {
    set({ selectedRegion: region });
  },

  // 위치 제거
  clearLocation: () => {
    set({
      latitude: null,
      longitude: null,
      address: null,
      selectedRegion: null,
    });
  },
}));
