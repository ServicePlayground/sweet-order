"use client";

/**
 * 지도 페이지
 * - 플랫폼 입점 스토어: API 전체 조회 후 마커 표시 (입점)
 * - 카카오 검색: 주변 "주문제작 케이크" 검색 (미입점, 플랫폼과 겹치면 제외)
 * - 현재위치: 있으면 중심, 없으면 강남구 / 버튼으로 재요청 가능
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { BottomNav } from "@/apps/web-user/common/components/navigation/BottomNav";
import { REGION_COORDINATES } from "@/apps/web-user/common/constants/region-coordinates.constant";
import { useUserLocation } from "@/apps/web-user/common/hooks/useUserLocation";
import { Icon } from "@/apps/web-user/common/components/icons";
import { storeApi } from "@/apps/web-user/features/store/apis/store.api";
import type { StoreInfo } from "@/apps/web-user/features/store/types/store.type";
import { MapStoreCard } from "@/apps/web-user/features/store/components/map/MapStoreCard";

declare global {
  interface Window {
    kakao: any;
  }
}

/** 현재위치 없을 때 기본 지도 중심 (강남구) */
const DEFAULT_CENTER = REGION_COORDINATES["서울"]?.["강남구"] ?? {
  lat: 37.5172,
  lng: 127.0473,
};

/** 오버레이 텍스트 XSS 방지용 이스케이프 */
const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export default function MapPage() {
  const kakaoJavascriptKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const { location: userLocation, refresh: refreshUserLocation } = useUserLocation();
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);

  // 지도/마커 ref
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const placesServiceRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);
  const platformMarkersRef = useRef<any[]>([]);
  const platformOverlaysRef = useRef<any[]>([]);
  const platformStoresRef = useRef<StoreInfo[]>([]);
  // 마커 이미지 (미입점/입점, 기본/포커스)
  const markerImageRef = useRef<any | null>(null);
  const focusedMarkerImageRef = useRef<any | null>(null);
  const openedMarkerImageRef = useRef<any | null>(null);
  const openedFocusedMarkerImageRef = useRef<any | null>(null);
  const selectedMarkerRef = useRef<any | null>(null);
  const isCenteringFromClickRef = useRef(false); // panTo 시 idle 재검색 방지
  const usedUserLocationForCenterRef = useRef(false); // 이미 사용자위치로 이동했는지
  const userLocationOverlayRef = useRef<any | null>(null);

  /** 카카오 검색 마커 제거 + 플랫폼 마커 포커스 해제 (재검색 시 호출) */
  const clearKakaoMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    if (openedMarkerImageRef.current) {
      platformMarkersRef.current.forEach((m) => m.setImage(openedMarkerImageRef.current));
    }
    selectedMarkerRef.current = null;
  }, []);

  /** 좌표 키 (겹침 판단용, precision 5=~1m, 4=~10m) */
  const getPositionKey = (lat: number, lng: number, precision = 5) =>
    `${Number(lat).toFixed(precision)},${Number(lng).toFixed(precision)}`;

  /** 스토어명 유사도: 한쪽이 다른 쪽을 포함하면 동일 스토어로 간주 */
  const isNameSimilar = (name1: string, name2: string): boolean => {
    const n1 = (name1 ?? "").trim().replace(/\s+/g, " ").toLowerCase();
    const n2 = (name2 ?? "").trim().replace(/\s+/g, " ").toLowerCase();
    if (!n1 || !n2 || n1.length < 2 || n2.length < 2) return false;
    return n1.includes(n2) || n2.includes(n1);
  };

  /** 좌표+스토어명으로 플랫폼 스토어와 중복인지 판단 (카카오 결과 제외용) */
  const isPlatformStoreDuplicate = useCallback((lat: number, lng: number, placeName: string) => {
    return platformStoresRef.current.some((s) => {
      const coordStrict =
        getPositionKey(lat, lng, 5) === getPositionKey(s.latitude, s.longitude, 5);
      const coordNearby =
        getPositionKey(lat, lng, 4) === getPositionKey(s.latitude, s.longitude, 4);

      if (!coordStrict && !coordNearby) return false;

      return isNameSimilar(placeName, s.name ?? "");
    });
  }, []);

  /** 플랫폼 입점 스토어 마커 그리기 */
  const drawPlatformStoreMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!window.kakao?.maps || !map) return;

    platformMarkersRef.current.forEach((m) => m.setMap(null));
    platformMarkersRef.current = [];
    platformOverlaysRef.current.forEach((o) => o.setMap(null));
    platformOverlaysRef.current = [];

    if (platformStoresRef.current.length === 0) return;

    if (!openedMarkerImageRef.current) {
      openedMarkerImageRef.current = new window.kakao.maps.MarkerImage(
        "/images/contents/map-opened.png",
        new window.kakao.maps.Size(24, 28),
        { offset: new window.kakao.maps.Point(12, 28) },
      );
    }
    if (!openedFocusedMarkerImageRef.current) {
      openedFocusedMarkerImageRef.current = new window.kakao.maps.MarkerImage(
        "/images/contents/map-opened-focus.png",
        new window.kakao.maps.Size(35, 40),
        { offset: new window.kakao.maps.Point(17.5, 40) },
      );
    }

    platformStoresRef.current.forEach((store) => {
      if (store.latitude == null || store.longitude == null) return;

      const position = new window.kakao.maps.LatLng(store.latitude, store.longitude);
      const marker = new window.kakao.maps.Marker({
        map,
        position,
        image: openedMarkerImageRef.current,
      });
      platformMarkersRef.current.push(marker);

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (markerImageRef.current) {
          markersRef.current.forEach((m) => m.setImage(markerImageRef.current));
        }
        if (openedMarkerImageRef.current) {
          platformMarkersRef.current.forEach((m) => m.setImage(openedMarkerImageRef.current));
        }
        if (openedFocusedMarkerImageRef.current) {
          marker.setImage(openedFocusedMarkerImageRef.current);
          selectedMarkerRef.current = marker;
        }
        if (map && typeof map.panTo === "function") {
          isCenteringFromClickRef.current = true;
          map.panTo(position);
        }
        setSelectedStore(store);
      });

      const safeName = escapeHtml(store.name ?? "");
      const overlayContent = `
        <div class="flex flex-col items-center pointer-events-none" style="margin-top:-4px;">
          <p class="text-center text-[13px] leading-[1.4] font-bold text-gray-900" style="text-shadow: -1px 0px #ffffff, 0px 1px #ffffff, 1px 0px #ffffff, 0px -1px #ffffff;">
            ${safeName}
          </p>
        </div>
      `;
      const overlay = new window.kakao.maps.CustomOverlay({
        map,
        position,
        yAnchor: 0,
        content: overlayContent,
      });
      platformOverlaysRef.current.push(overlay);
    });
  }, []);

  /** 현재위치 마커 표시/제거 (위치 없으면 제거) */
  const updateUserLocationMarker = (location: { latitude: number; longitude: number } | null) => {
    const map = mapInstanceRef.current;
    if (!window.kakao?.maps || !map) return;

    // 기존 제거
    if (userLocationOverlayRef.current) {
      userLocationOverlayRef.current.setMap(null);
      userLocationOverlayRef.current = null;
    }

    if (!location) return;

    const position = new window.kakao.maps.LatLng(location.latitude, location.longitude);

    const userLocationContent = `
      <img
        src="/images/contents/map-current-position.png"
        alt="현재 위치"
        style="width: 34px; height: 34px; pointer-events: none; display: block;"
      />
    `;
    const overlay = new window.kakao.maps.CustomOverlay({
      map,
      position,
      content: userLocationContent,
      yAnchor: 0.5,
      xAnchor: 0.5,
    });
    userLocationOverlayRef.current = overlay;
  };

  /** 카카오 키워드 검색 → 플랫폼과 겹치지 않는 미입점만 마커 표시 */
  const searchPlaces = (centerLatLng: any) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return;

    if (!placesServiceRef.current) {
      placesServiceRef.current = new window.kakao.maps.services.Places();
    }

    if (!markerImageRef.current) {
      markerImageRef.current = new window.kakao.maps.MarkerImage(
        "/images/contents/map-unopened.png",
        new window.kakao.maps.Size(24, 28),
        {
          offset: new window.kakao.maps.Point(12, 28),
        },
      );
    }

    if (!focusedMarkerImageRef.current) {
      focusedMarkerImageRef.current = new window.kakao.maps.MarkerImage(
        "/images/contents/map-unopened-focus.png",
        new window.kakao.maps.Size(35, 40),
        {
          offset: new window.kakao.maps.Point(17.5, 40),
        },
      );
    }

    placesServiceRef.current.keywordSearch(
      "주문제작 케이크",
      (data: any[], status: string) => {
        if (status !== window.kakao.maps.services.Status.OK || !Array.isArray(data)) {
          clearKakaoMarkers();
          return;
        }

        const map = mapInstanceRef.current;
        if (!map) return;

        clearKakaoMarkers();

        data.forEach((place) => {
          const placeLat = Number(place.y);
          const placeLng = Number(place.x);
          if (isPlatformStoreDuplicate(placeLat, placeLng, place.place_name ?? "")) return;

          const position = new window.kakao.maps.LatLng(placeLat, placeLng);

          const marker = new window.kakao.maps.Marker({
            map,
            position,
            image: markerImageRef.current,
          });

          markersRef.current.push(marker);

          window.kakao.maps.event.addListener(marker, "click", () => {
            setSelectedStore(null); // 미입점 마커 클릭 시 플랫폼 스토어 카드 닫기
            if (markerImageRef.current) {
              markersRef.current.forEach((m) => m.setImage(markerImageRef.current));
            }
            if (openedMarkerImageRef.current) {
              platformMarkersRef.current.forEach((m) => m.setImage(openedMarkerImageRef.current));
            }

            // 현재 클릭된 마커를 포커스 이미지로 변경
            if (focusedMarkerImageRef.current) {
              marker.setImage(focusedMarkerImageRef.current);
              selectedMarkerRef.current = marker;
            }

            // 클릭한 마커 위치를 지도 중앙으로 이동 (이동 중 idle로 인한 재검색 방지 플래그 설정)
            if (map && typeof map.panTo === "function") {
              isCenteringFromClickRef.current = true;
              map.panTo(position);
            }
          });

          const safeName = escapeHtml(place.place_name ?? "");

          const overlayContent = `
            <div class="flex flex-col items-center pointer-events-none" style="margin-top:-4px;">
              <p
                class="text-center text-[13px] leading-[1.4] font-bold text-gray-900"
                style="text-shadow: -1px 0px #ffffff, 0px 1px #ffffff, 1px 0px #ffffff, 0px -1px #ffffff;"
              >
                ${safeName}
              </p>
              <p
                class="text-center text-[11px] leading-[1.4] font-bold text-gray-500"
                style="text-shadow: -1px 0px #ffffff, 0px 1px #ffffff, 1px 0px #ffffff, 0px -1px #ffffff;"
              >
                미입점
              </p>
            </div>
          `;

          const overlay = new window.kakao.maps.CustomOverlay({
            map,
            position,
            yAnchor: 0,
            content: overlayContent,
          });

          overlaysRef.current.push(overlay);
        });
      },
      {
        location: centerLatLng,
        useMapBounds: true, // 지도 바운더리 내에서만 검색
      },
    );
  };

  /** 카카오 지도 초기화 + 플랫폼/카카오 마커 + idle 이벤트 등록 */
  const initializeMap = (center: { lat: number; lng: number }) => {
    if (!window.kakao || !window.kakao.maps) return;
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    window.kakao.maps.load(() => {
      const centerLatLng = new window.kakao.maps.LatLng(center.lat, center.lng);

      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: centerLatLng,
        level: 5,
      });

      mapInstanceRef.current = map;

      drawPlatformStoreMarkers();
      searchPlaces(centerLatLng);
      updateUserLocationMarker(userLocation ?? null);

      // 지도 이동/줌 변경 시 마커 재검색
      window.kakao.maps.event.addListener(map, "idle", () => {
        // 마커 클릭으로 인한 center 이동이면 한 번은 재검색을 건너뜀
        if (isCenteringFromClickRef.current) {
          isCenteringFromClickRef.current = false;
          return;
        }

        const currentCenter = map.getCenter();
        searchPlaces(currentCenter);
      });

      // 지도 빈 영역 클릭 시 스토어 카드 닫기
      window.kakao.maps.event.addListener(map, "click", () => {
        setSelectedStore(null);
      });
    });
  };

  /** 초기 지도 중심: 현재위치 있으면 사용, 없으면 강남구 */
  const getInitialCenter = (): { lat: number; lng: number } => {
    if (userLocation) {
      usedUserLocationForCenterRef.current = true;
      return { lat: userLocation.latitude, lng: userLocation.longitude };
    }
    return DEFAULT_CENTER;
  };

  const handleKakaoScriptLoad = () => {
    setKakaoLoaded(true);
  };

  /** 지도 초기화: 카카오 로드 후 getInitialCenter로 중심 설정 */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const kakaoReady = kakaoLoaded || (window.kakao && window.kakao.maps);
    if (!kakaoReady || mapInstanceRef.current) return;

    const center = getInitialCenter();
    initializeMap(center);
  }, [kakaoLoaded, userLocation]);

  /** 현재위치가 비동기로 도착한 경우, 지도 중심으로 이동 */
  useEffect(() => {
    if (!userLocation || !mapInstanceRef.current || usedUserLocationForCenterRef.current) return;

    const map = mapInstanceRef.current;
    if (typeof map.panTo === "function") {
      const centerLatLng = new window.kakao.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude,
      );
      isCenteringFromClickRef.current = true;
      map.panTo(centerLatLng);
      searchPlaces(centerLatLng);
    }
    usedUserLocationForCenterRef.current = true;
  }, [userLocation]);

  /** 사용자 위치 마커 갱신 (위치 변경 시) */
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    updateUserLocationMarker(userLocation ?? null);
  }, [userLocation]);

  /** 전국 플랫폼 스토어 페이지네이션 조회 후 마커/카카오 검색 갱신 */
  useEffect(() => {
    const fetchAllStores = async () => {
      const allStores: StoreInfo[] = [];
      let page = 1;
      const limit = 1000;
      let hasNext = true;

      while (hasNext) {
        const result = await storeApi.getList({ page, limit });
        allStores.push(...result.data);
        hasNext = result.meta.hasNext;
        page += 1;
      }

      return allStores.filter((s) => s.latitude != null && s.longitude != null);
    };

    fetchAllStores()
      .then((stores) => {
        platformStoresRef.current = stores;
        const map = mapInstanceRef.current;
        if (map) {
          drawPlatformStoreMarkers();
          const center = map.getCenter();
          searchPlaces(center);
        }
      })
      .catch(() => {});
  }, [drawPlatformStoreMarkers]);

  if (!kakaoJavascriptKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-sm text-gray-500">
        <p className="mb-2 font-semibold">카카오 지도 설정이 필요합니다.</p>
        <p className="text-center">
          <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
            NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
          </code>
          환경변수를 설정한 뒤 다시 시도해주세요.
        </p>
      </div>
    );
  }

  const kakaoSdkUrl = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoJavascriptKey}&libraries=services&autoload=false`;

  /** 현재위치 버튼 클릭: 위치 재요청 후 도착 시 지도 중심 이동 */
  const handleRefreshLocation = () => {
    usedUserLocationForCenterRef.current = false;
    refreshUserLocation();
  };

  return (
    <div className="relative w-full h-screen">
      <Script src={kakaoSdkUrl} strategy="afterInteractive" onLoad={handleKakaoScriptLoad} />
      <div className="h-full">
        <div ref={mapContainerRef} className="w-full h-full" aria-label="주변 베이커리 지도" />
      </div>
      <button
        type="button"
        onClick={handleRefreshLocation}
        className="absolute right-[15px] bottom-20 z-10 flex h-10 w-10 items-center justify-center rounded-[26px] border border-[#EBEBEA] bg-white p-2.5"
        style={{ boxShadow: "0px 2px 10px 0px #0000000A" }}
        aria-label="내 위치로 이동"
      >
        <Icon name="currentLocation" width={20} height={20} className="text-blue-400" />
      </button>
      {selectedStore && (
        <div
          className="absolute z-30"
          style={{
            left: 16,
            right: 16,
            bottom: 92, // 60(바텀 네비 높이) + 32
          }}
        >
          <MapStoreCard store={selectedStore} />
        </div>
      )}
      <BottomNav />
    </div>
  );
}
