"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { BottomNav } from "@/apps/web-user/common/components/navigation/BottomNav";
import { REGION_COORDINATES } from "@/apps/web-user/common/constants/region-coordinates.constant";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {
  const kakaoJavascriptKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const placesServiceRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);
  const markerImageRef = useRef<any | null>(null);
  const focusedMarkerImageRef = useRef<any | null>(null);
  const selectedMarkerRef = useRef<any | null>(null);

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
            // 이전 선택 마커가 있으면 기본 이미지로 복구
            if (selectedMarkerRef.current && markerImageRef.current) {
              selectedMarkerRef.current.setImage(markerImageRef.current);
            }

            // 현재 클릭된 마커를 포커스 이미지로 변경
            if (focusedMarkerImageRef.current) {
              marker.setImage(focusedMarkerImageRef.current);
              selectedMarkerRef.current = marker;
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

  const initializeMap = () => {
    if (!window.kakao || !window.kakao.maps) return;
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const DEFAULT_CENTER = REGION_COORDINATES["서울"]?.["강남구"] ?? {
      lat: 37.5172,
      lng: 127.0473,
    };

    window.kakao.maps.load(() => {
      const centerLatLng = new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);

      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: centerLatLng,
        level: 5,
      });

      mapInstanceRef.current = map;

      searchPlaces(centerLatLng);

      // 지도 이동/줌 변경 시 마커 재검색
      window.kakao.maps.event.addListener(map, "idle", () => {
        const currentCenter = map.getCenter();
        searchPlaces(currentCenter);
      });
    });
  };

  // 카카오 스크립트 로드 콜백 (첫 진입 시)
  const handleKakaoScriptLoad = () => {
    initializeMap();
  };

  // 탭 이동 후 재진입 시, 이미 스크립트가 로드되어 있다면 직접 초기화
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.kakao && window.kakao.maps && !mapInstanceRef.current) {
      initializeMap();
    }
  }, []);

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

  return (
    <div className="relative w-full h-screen">
      <Script src={kakaoSdkUrl} strategy="afterInteractive" onLoad={handleKakaoScriptLoad} />
      <div className="h-full">
        <div ref={mapContainerRef} className="w-full h-full" aria-label="주변 베이커리 지도" />
      </div>
      <BottomNav />
    </div>
  );
}
