import type { StoreInfo } from "@/apps/web-user/features/store/types/store.type";

/** 지도 오버레이용 텍스트 XSS 방지 이스케이프 */
export function escapeHtmlForOverlay(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 좌표 키 (겹침 판단용, precision 5 ≈ 1m, 4 ≈ 10m) */
export function getPositionKey(lat: number, lng: number, precision = 5): string {
  return `${Number(lat).toFixed(precision)},${Number(lng).toFixed(precision)}`;
}

/** 스토어명 유사도: 한쪽이 다른 쪽을 포함하면 동일 스토어로 간주 */
export function isStoreNameSimilar(name1: string, name2: string): boolean {
  const n1 = (name1 ?? "").trim().replace(/\s+/g, " ").toLowerCase();
  const n2 = (name2 ?? "").trim().replace(/\s+/g, " ").toLowerCase();
  if (!n1 || !n2 || n1.length < 2 || n2.length < 2) return false;
  return n1.includes(n2) || n2.includes(n1);
}

/** 지도 bounds 내에 있는 스토어만 필터 (카카오 map.getBounds() 반환값 기준) */
export function getStoresInMapBounds(map: unknown, stores: StoreInfo[]): StoreInfo[] {
  const m = map as { getBounds?: () => { getSouthWest?: () => { getLat(): number; getLng(): number }; getNorthEast?: () => { getLat(): number; getLng(): number } } };
  if (!m?.getBounds) return [];
  const bounds = m.getBounds();
  if (!bounds?.getSouthWest || !bounds?.getNorthEast) return [];
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const minLat = Math.min(sw.getLat(), ne.getLat());
  const maxLat = Math.max(sw.getLat(), ne.getLat());
  const minLng = Math.min(sw.getLng(), ne.getLng());
  const maxLng = Math.max(sw.getLng(), ne.getLng());
  return stores.filter((store) => {
    if (store.latitude == null || store.longitude == null) return false;
    const { latitude: lat, longitude: lng } = store;
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  });
}

/** 좌표가 있는 스토어만 필터 (타입 가드) */
export function filterStoresWithCoordinates(
  stores: StoreInfo[],
): (StoreInfo & { latitude: number; longitude: number })[] {
  return stores.filter(
    (s): s is StoreInfo & { latitude: number; longitude: number } =>
      s.latitude != null && s.longitude != null,
  );
}
