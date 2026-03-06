"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { BottomNav } from "@/apps/web-user/common/components/navigation/BottomNav";
import { REGION_COORDINATES } from "@/apps/web-user/common/constants/region-coordinates.constant";
import { useUserLocation } from "@/apps/web-user/common/hooks/useUserLocation";
import { Icon } from "@/apps/web-user/common/components/icons";

declare global {
  interface Window {
    kakao: any;
  }
}

const DEFAULT_CENTER = REGION_COORDINATES["서울"]?.["강남구"] ?? {
  lat: 37.5172,
  lng: 127.0473,
};

export default function MapPage() {
  const kakaoJavascriptKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const { location: userLocation, refresh: refreshUserLocation } = useUserLocation();
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const placesServiceRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);
  const markerImageRef = useRef<any | null>(null);
  const focusedMarkerImageRef = useRef<any | null>(null);
  const selectedMarkerRef = useRef<any | null>(null);
  const isCenteringFromClickRef = useRef(false);
  const usedUserLocationForCenterRef = useRef(false);
  const userLocationOverlayRef = useRef<any | null>(null);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    overlaysRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });
    overlaysRef.current = [];

    selectedMarkerRef.current = null;
  };

  // 사용자 현재위치 표시
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

  // 키워드 검색으로 주변 베이커리 매장 검색 후, 마커 표시
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
          clearMarkers();
          return;
        }

        const map = mapInstanceRef.current;
        if (!map) return;

        clearMarkers();

        data.forEach((place) => {
          const position = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));

          const marker = new window.kakao.maps.Marker({
            map,
            position,
            image: markerImageRef.current,
          });

          markersRef.current.push(marker);

          window.kakao.maps.event.addListener(marker, "click", () => {
            // 모든 마커를 기본 이미지로 초기화
            if (markerImageRef.current) {
              markersRef.current.forEach((m) => {
                m.setImage(markerImageRef.current);
              });
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

          const safeName = place.place_name ?? "";

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
    });
  };

  // 초기 중심: 현재위치 있으면 사용, 없으면 강남구
  const getInitialCenter = (): { lat: number; lng: number } => {
    if (userLocation) {
      usedUserLocationForCenterRef.current = true;
      return { lat: userLocation.latitude, lng: userLocation.longitude };
    }
    return DEFAULT_CENTER;
  };

  // 카카오 스크립트 로드 콜백 (첫 진입 시)
  const handleKakaoScriptLoad = () => {
    setKakaoLoaded(true);
  };

  // 지도 초기화: 카카오 로드 후 스토어/현재위치 우선, 없으면 강남구
  useEffect(() => {
    if (typeof window === "undefined") return;
    const kakaoReady = kakaoLoaded || (window.kakao && window.kakao.maps);
    if (!kakaoReady || mapInstanceRef.current) return;

    const center = getInitialCenter();
    initializeMap(center);
  }, [kakaoLoaded, userLocation]);

  // useUserLocation이 비동기로 도착한 경우, 현재위치로 이동
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

  // 사용자 위치 파란색 원 표시 (위치 있으면 표시, 없으면 제거)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    updateUserLocationMarker(userLocation ?? null);
  }, [userLocation]);

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

  const handleRefreshLocation = () => {
    usedUserLocationForCenterRef.current = false; // 새 위치 도착 시 지도 이동 허용
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
      <BottomNav />
    </div>
  );
}
