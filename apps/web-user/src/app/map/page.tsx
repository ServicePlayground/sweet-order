"use client";

/**
 * 지도 페이지
 * - 플랫폼 입점 스토어: API 전체 조회 후 현재 지도 범위 내 마커 표시
 * - URL ?q= 검색 시: 스토어 검색 API로 결과 표시 + 목록 패널 자동 오픈
 * - 카카오 키워드 검색: 주변 미입점 마커 (플랫폼과 겹치면 제외)
 * - 현재위치: 있으면 중심, 없으면 강남구 / 버튼으로 재요청
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { BottomNav } from "@/apps/web-user/common/components/navigation/BottomNav";
import { useUserLocation } from "@/apps/web-user/common/hooks/useUserLocation";
import { Icon } from "@/apps/web-user/common/components/icons";
import { storeApi } from "@/apps/web-user/features/store/apis/store.api";
import type { StoreInfo } from "@/apps/web-user/features/store/types/store.type";
import { MapStoreCard } from "@/apps/web-user/features/store/components/map/MapStoreCard";
import { MapStoreListSection } from "@/apps/web-user/features/store/components/map/MapStoreListSection";
import { MapTopSearchBar } from "@/apps/web-user/features/store/components/map/MapTopSearchBar";
import { MapListSheetPanel } from "@/apps/web-user/features/store/components/map/MapListSheetPanel";
import { useMapListSheet } from "@/apps/web-user/features/store/hooks/useMapListSheet";
import {
  DEFAULT_MAP_CENTER,
  MAP_BOUNDS_PADDING,
  KAKAO_PLACES_KEYWORD,
} from "@/apps/web-user/features/store/constants/map.constant";
import {
  escapeHtmlForOverlay,
  getPositionKey,
  isStoreNameSimilar,
  getStoresInMapBounds,
  filterStoresWithCoordinates,
} from "@/apps/web-user/features/store/utils/map.util";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() || null;
  const kakaoJavascriptKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const { location: userLocation, refresh: refreshUserLocation } = useUserLocation();

  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);

  // ---- Refs: 지도·마커 ----
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const placesServiceRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);
  const platformMarkersRef = useRef<any[]>([]);
  const platformOverlaysRef = useRef<any[]>([]);
  const platformStoresRef = useRef<StoreInfo[]>([]);
  const searchStoresRef = useRef<StoreInfo[] | null>(null);
  const markerImageRef = useRef<any | null>(null);
  const focusedMarkerImageRef = useRef<any | null>(null);
  const openedMarkerImageRef = useRef<any | null>(null);
  const openedFocusedMarkerImageRef = useRef<any | null>(null);
  const selectedMarkerRef = useRef<any | null>(null);
  const isCenteringFromClickRef = useRef(false);
  const usedUserLocationForCenterRef = useRef(false);
  const userLocationOverlayRef = useRef<any | null>(null);

  // 목록에 쓸 스토어: 검색 모드면 검색 결과 중 지도 범위 내, 아니면 지도 범위 내 플랫폼 스토어
  const getStoresForList = useCallback((): StoreInfo[] => {
    const map = mapInstanceRef.current;
    if (!map) return [];
    const source =
      searchStoresRef.current !== null ? searchStoresRef.current : platformStoresRef.current;
    return getStoresInMapBounds(map, source);
  }, []);

  const listSheet = useMapListSheet(getStoresForList);

  const {
    listSheetStores,
    setListSheetStores,
    listSheetPanelOffset,
    setListSheetPanelOffset,
    isListSheetPanelDragging,
    listSheetPanelOffsetRef,
    listSheetPanelMaxOffsetRef,
    getListSheetMaxOffset,
    openListSheet,
    closeListSheet,
    handlePointerDown: listSheetHandlePointerDown,
    handlePointerMove: listSheetHandlePointerMove,
    handlePointerUp: listSheetHandlePointerUp,
  } = listSheet;

  // ---- 지도 범위 내 스토어 (마커 표시용): 검색 모드면 검색 결과만, 아니면 지도 범위 내 플랫폼 스토어
  const getStoresToShow = useCallback((map: any): StoreInfo[] => {
    if (searchStoresRef.current !== null) return searchStoresRef.current;
    return getStoresInMapBounds(map, platformStoresRef.current);
  }, []);

  const isPlatformStoreDuplicate = useCallback((lat: number, lng: number, placeName: string) => {
    return platformStoresRef.current.some((s) => {
      const samePos =
        getPositionKey(lat, lng, 5) === getPositionKey(s.latitude!, s.longitude!, 5) ||
        getPositionKey(lat, lng, 4) === getPositionKey(s.latitude!, s.longitude!, 4);
      if (!samePos) return false;
      return isStoreNameSimilar(placeName, s.name ?? "");
    });
  }, []);

  const clearKakaoMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];
    if (openedMarkerImageRef.current) {
      platformMarkersRef.current.forEach((m) => m.setImage(openedMarkerImageRef.current));
    }
    selectedMarkerRef.current = null;
  }, []);

  const drawPlatformStoreMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!window.kakao?.maps || !map) return;

    platformMarkersRef.current.forEach((m) => m.setMap(null));
    platformMarkersRef.current = [];
    platformOverlaysRef.current.forEach((o) => o.setMap(null));
    platformOverlaysRef.current = [];

    const stores = getStoresToShow(map);
    if (stores.length === 0) return;

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

    stores.forEach((store) => {
      if (store.latitude == null || store.longitude == null) return;
      const position = new window.kakao.maps.LatLng(store.latitude, store.longitude);
      const marker = new window.kakao.maps.Marker({
        map,
        position,
        image: openedMarkerImageRef.current,
      });
      platformMarkersRef.current.push(marker);

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (markerImageRef.current)
          markersRef.current.forEach((m) => m.setImage(markerImageRef.current));
        if (openedMarkerImageRef.current)
          platformMarkersRef.current.forEach((m) => m.setImage(openedMarkerImageRef.current));
        if (openedFocusedMarkerImageRef.current) {
          marker.setImage(openedFocusedMarkerImageRef.current);
          selectedMarkerRef.current = marker;
        }
        if (map?.panTo) {
          isCenteringFromClickRef.current = true;
          map.panTo(position);
        }
        setSelectedStore(store);
      });

      const safeName = escapeHtmlForOverlay(store.name ?? "");
      const overlay = new window.kakao.maps.CustomOverlay({
        map,
        position,
        yAnchor: 0,
        content: `<div class="flex flex-col items-center pointer-events-none" style="margin-top:-4px;"><p class="text-center text-[13px] leading-[1.4] font-bold text-gray-900" style="text-shadow: -1px 0px #fff, 0px 1px #fff, 1px 0px #fff, 0px -1px #fff;">${safeName}</p></div>`,
      });
      platformOverlaysRef.current.push(overlay);
    });
  }, [getStoresToShow]);

  const updateUserLocationMarker = useCallback(
    (location: { latitude: number; longitude: number } | null) => {
      const map = mapInstanceRef.current;
      if (!window.kakao?.maps || !map) return;
      if (userLocationOverlayRef.current) {
        userLocationOverlayRef.current.setMap(null);
        userLocationOverlayRef.current = null;
      }
      if (!location) return;
      const position = new window.kakao.maps.LatLng(location.latitude, location.longitude);
      userLocationOverlayRef.current = new window.kakao.maps.CustomOverlay({
        map,
        position,
        content:
          '<img src="/images/contents/map-current-position.png" alt="현재 위치" style="width:34px;height:34px;pointer-events:none;display:block" />',
        yAnchor: 0.5,
        xAnchor: 0.5,
      });
    },
    [],
  );

  const searchPlaces = useCallback(
    (centerLatLng: any) => {
      if (!window.kakao?.maps?.services) return;
      if (!placesServiceRef.current)
        placesServiceRef.current = new window.kakao.maps.services.Places();
      if (!markerImageRef.current) {
        markerImageRef.current = new window.kakao.maps.MarkerImage(
          "/images/contents/map-unopened.png",
          new window.kakao.maps.Size(24, 28),
          { offset: new window.kakao.maps.Point(12, 28) },
        );
      }
      if (!focusedMarkerImageRef.current) {
        focusedMarkerImageRef.current = new window.kakao.maps.MarkerImage(
          "/images/contents/map-unopened-focus.png",
          new window.kakao.maps.Size(35, 40),
          { offset: new window.kakao.maps.Point(17.5, 40) },
        );
      }

      placesServiceRef.current.keywordSearch(
        KAKAO_PLACES_KEYWORD,
        (data: any[], status: string) => {
          if (status !== window.kakao.maps.services.Status.OK || !Array.isArray(data)) {
            clearKakaoMarkers();
            return;
          }
          const map = mapInstanceRef.current;
          if (!map) return;
          clearKakaoMarkers();
          data.forEach((place) => {
            const lat = Number(place.y);
            const lng = Number(place.x);
            if (isPlatformStoreDuplicate(lat, lng, place.place_name ?? "")) return;
            const position = new window.kakao.maps.LatLng(lat, lng);
            const marker = new window.kakao.maps.Marker({
              map,
              position,
              image: markerImageRef.current,
            });
            markersRef.current.push(marker);
            window.kakao.maps.event.addListener(marker, "click", () => {
              setSelectedStore(null);
              if (markerImageRef.current)
                markersRef.current.forEach((m) => m.setImage(markerImageRef.current));
              if (openedMarkerImageRef.current)
                platformMarkersRef.current.forEach((m) => m.setImage(openedMarkerImageRef.current));
              if (focusedMarkerImageRef.current) {
                marker.setImage(focusedMarkerImageRef.current);
                selectedMarkerRef.current = marker;
              }
              if (map?.panTo) {
                isCenteringFromClickRef.current = true;
                map.panTo(position);
              }
            });
            const safeName = escapeHtmlForOverlay(place.place_name ?? "");
            overlaysRef.current.push(
              new window.kakao.maps.CustomOverlay({
                map,
                position,
                yAnchor: 0,
                content: `<div class="flex flex-col items-center pointer-events-none" style="margin-top:-4px;"><p class="text-center text-[13px] leading-[1.4] font-bold text-gray-900" style="text-shadow: -1px 0px #fff, 0px 1px #fff, 1px 0px #fff, 0px -1px #fff;">${safeName}</p><p class="text-center text-[11px] leading-[1.4] font-bold text-gray-500" style="text-shadow: -1px 0px #fff, 0px 1px #fff, 1px 0px #fff, 0px -1px #fff;">미입점</p></div>`,
              }),
            );
          });
        },
        { location: centerLatLng, useMapBounds: true },
      );
    },
    [clearKakaoMarkers, isPlatformStoreDuplicate],
  );

  const getInitialCenter = useCallback((): { lat: number; lng: number } => {
    if (userLocation) {
      usedUserLocationForCenterRef.current = true;
      return { lat: userLocation.latitude, lng: userLocation.longitude };
    }
    return DEFAULT_MAP_CENTER;
  }, [userLocation]);

  const initializeMap = useCallback(
    (center: { lat: number; lng: number }, isSearchMode: boolean) => {
      if (!window.kakao?.maps || !mapContainerRef.current || mapInstanceRef.current) return;
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapContainerRef.current, {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: 5,
        });
        mapInstanceRef.current = map;

        if (isSearchMode) clearKakaoMarkers();
        drawPlatformStoreMarkers();
        if (!isSearchMode) searchPlaces(new window.kakao.maps.LatLng(center.lat, center.lng));
        updateUserLocationMarker(userLocation ?? null);

        window.kakao.maps.event.addListener(map, "idle", () => {
          if (isCenteringFromClickRef.current) {
            isCenteringFromClickRef.current = false;
            return;
          }
          drawPlatformStoreMarkers();
          if (searchStoresRef.current === null) searchPlaces(map.getCenter());
          if (listSheetPanelOffsetRef.current > 0) {
            setListSheetStores(getStoresForList());
          }
          if (
            searchStoresRef.current === null &&
            getStoresForList().length === 0 &&
            listSheetPanelOffsetRef.current > 0
          ) {
            closeListSheet();
          }
        });

        window.kakao.maps.event.addListener(map, "click", () => {
          setSelectedStore(null);
          if (listSheetPanelOffsetRef.current > 0) closeListSheet();
        });

        // 검색 결과가 이미 있으면(지도 생성 전 fetch 완료) bounds·패널 적용
        const stores = searchStoresRef.current;
        if (stores !== null) {
          if (stores.length > 0 && window.kakao.maps.LatLngBounds) {
            const bounds = new window.kakao.maps.LatLngBounds();
            stores.forEach((s) =>
              bounds.extend(new window.kakao.maps.LatLng(s.latitude!, s.longitude!)),
            );
            map.setBounds(bounds, MAP_BOUNDS_PADDING);
          } else if (stores.length === 0) {
            const center =
              userLocation != null
                ? new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude)
                : new window.kakao.maps.LatLng(DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng);
            map.setCenter(center);
          }
          setListSheetStores(getStoresForList());
          const maxOff = getListSheetMaxOffset();
          listSheetPanelMaxOffsetRef.current = maxOff;
          listSheetPanelOffsetRef.current = maxOff;
          setListSheetPanelOffset(maxOff);
        }
      });
    },
    [
      clearKakaoMarkers,
      drawPlatformStoreMarkers,
      searchPlaces,
      updateUserLocationMarker,
      userLocation,
      closeListSheet,
      getListSheetMaxOffset,
      getStoresForList,
      setListSheetStores,
      setListSheetPanelOffset,
    ],
  );

  // ---- Effects ----
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ready = kakaoLoaded || (window.kakao && window.kakao.maps);
    if (!ready || mapInstanceRef.current) return;
    initializeMap(getInitialCenter(), !!searchQuery);
  }, [kakaoLoaded, userLocation, searchQuery, getInitialCenter, initializeMap]);

  // 검색 모드가 아닐 때만 현재위치로 지도 이동 (검색 후 현재위치로 덮어쓰기 방지)
  useEffect(() => {
    if (
      searchQuery ||
      !userLocation ||
      !mapInstanceRef.current ||
      usedUserLocationForCenterRef.current
    )
      return;
    const map = mapInstanceRef.current;
    if (map.panTo) {
      isCenteringFromClickRef.current = true;
      map.panTo(new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude));
      if (searchStoresRef.current === null) searchPlaces(map.getCenter());
    }
    usedUserLocationForCenterRef.current = true;
  }, [userLocation, searchQuery, searchPlaces]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    updateUserLocationMarker(userLocation ?? null);
  }, [userLocation, updateUserLocationMarker]);

  useEffect(() => {
    const fetchAll = async () => {
      const list: StoreInfo[] = [];
      let page = 1;
      const limit = 1000;
      let hasNext = true;
      while (hasNext) {
        const res = await storeApi.getList({ page, limit });
        list.push(...res.data);
        hasNext = res.meta.hasNext;
        page += 1;
      }
      return filterStoresWithCoordinates(list);
    };
    fetchAll()
      .then((stores) => {
        platformStoresRef.current = stores;
        const map = mapInstanceRef.current;
        if (map) {
          drawPlatformStoreMarkers();
          if (searchStoresRef.current === null) searchPlaces(map.getCenter());
        }
      })
      .catch(() => {});
  }, [drawPlatformStoreMarkers, searchPlaces]);

  useEffect(() => {
    if (!searchQuery) {
      searchStoresRef.current = null;
      const map = mapInstanceRef.current;
      if (map) drawPlatformStoreMarkers();
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await storeApi.getList({ search: searchQuery, page: 1, limit: 100 });
        const stores = filterStoresWithCoordinates(res.data ?? []);
        if (cancelled) return;
        searchStoresRef.current = stores;
        const map = mapInstanceRef.current;
        if (!map || !window.kakao?.maps) return;
        clearKakaoMarkers();
        drawPlatformStoreMarkers();
        if (stores.length > 0) {
          const bounds = new window.kakao.maps.LatLngBounds();
          stores.forEach((s) =>
            bounds.extend(new window.kakao.maps.LatLng(s.latitude, s.longitude)),
          );
          map.setBounds(bounds, MAP_BOUNDS_PADDING);
        } else {
          const center = userLocation
            ? new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude)
            : new window.kakao.maps.LatLng(DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng);
          map.setCenter(center);
        }
        setListSheetStores(getStoresForList());
        const maxOff = getListSheetMaxOffset();
        listSheetPanelMaxOffsetRef.current = maxOff;
        listSheetPanelOffsetRef.current = maxOff;
        setListSheetPanelOffset(maxOff);
      } catch {
        searchStoresRef.current = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    searchQuery,
    userLocation,
    clearKakaoMarkers,
    drawPlatformStoreMarkers,
    getListSheetMaxOffset,
    getStoresForList,
    setListSheetStores,
    setListSheetPanelOffset,
  ]);

  // ---- Handlers ----
  const handleRefreshLocation = () => {
    usedUserLocationForCenterRef.current = false;
    refreshUserLocation();
  };

  const handleListSheetTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    listSheetHandlePointerDown(e.touches[0].clientY);
  };
  const handleListSheetTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    listSheetHandlePointerMove(e.touches[0].clientY);
  };
  const handleListSheetTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    listSheetHandlePointerUp();
  };
  const handleListSheetMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    listSheetHandlePointerDown(e.clientY);
  };

  useEffect(() => {
    if (!isListSheetPanelDragging) return;
    const onMove = (e: MouseEvent) => listSheetHandlePointerMove(e.clientY);
    const onUp = () => listSheetHandlePointerUp();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isListSheetPanelDragging, listSheetHandlePointerMove, listSheetHandlePointerUp]);

  // ---- Render ----
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
      <Script src={kakaoSdkUrl} strategy="afterInteractive" onLoad={() => setKakaoLoaded(true)} />
      <div className="h-full">
        <div ref={mapContainerRef} className="w-full h-full" aria-label="주변 베이커리 지도" />
      </div>

      <MapTopSearchBar searchQuery={searchQuery} />

      <button
        type="button"
        onClick={handleRefreshLocation}
        className="absolute right-[15px] bottom-32 z-10 flex h-10 w-10 items-center justify-center rounded-[26px] border border-[#EBEBEA] bg-white p-2.5"
        style={{ boxShadow: "0px 2px 10px 0px #0000000A" }}
        aria-label="내 위치로 이동"
      >
        <Icon name="currentLocation" width={20} height={20} className="text-blue-400" />
      </button>

      <button
        type="button"
        onClick={openListSheet}
        className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center bg-white"
        style={{
          bottom: 110,
          borderRadius: 26,
          border: "1px solid var(--grayscale-gr-100, #EBEBEA)",
          padding: "8px 14px",
          boxShadow: "0px 2px 10px 0px #0000000A",
        }}
        aria-label="목록 보기"
      >
        <span className="inline-flex items-center justify-center gap-1 leading-none">
          <span
            className="inline-flex shrink-0 items-center justify-center text-gray-900"
            style={{ width: 16, height: 16 }}
          >
            <Icon name="list" width={16} height={16} className="block" />
          </span>
          <span
            className="text-gray-900 block"
            style={{ fontWeight: 400, fontSize: 14, lineHeight: 1.4, paddingTop: 1 }}
          >
            목록 보기
          </span>
        </span>
      </button>

      {selectedStore && (
        <div className="absolute z-30" style={{ left: 16, right: 16, bottom: 120 }}>
          <MapStoreCard store={selectedStore} />
        </div>
      )}

      <MapListSheetPanel
        offset={listSheetPanelOffset}
        isDragging={isListSheetPanelDragging}
        onTouchStart={handleListSheetTouchStart}
        onTouchMove={handleListSheetTouchMove}
        onTouchEnd={handleListSheetTouchEnd}
        onMouseDown={handleListSheetMouseDown}
      >
        {listSheetPanelOffset > 0 && (
          <MapStoreListSection
            stores={listSheetStores}
            hideHandle
            hideSortFilter
            userLocation={userLocation}
          />
        )}
      </MapListSheetPanel>

      <BottomNav />
    </div>
  );
}
