/**
 * 전체 주소에서 시/군/구를 추출 후 접미사를 제거합니다.
 * 구 > 군 > 시 순서로 우선 추출합니다.
 * @example "서울특별시 서초구 XX동" → "서초"
 * @example "경기도 가평군 XX읍" → "가평"
 * @example "경기도 수원시 XX동" → "수원"
 * @example "세종특별자치시 XX동" → "세종"
 */
export function formatAddress(address: string): string {
  const tokens = address.split(" ");

  const gu = tokens.find((t) => t.endsWith("구"));
  if (gu) return gu.slice(0, -1);

  const gun = tokens.find((t) => t.endsWith("군"));
  if (gun) return gun.slice(0, -1);

  const si = tokens.find((t) => t.endsWith("시"));
  if (si) {
    if (si.endsWith("특별자치시")) return si.replace("특별자치시", "");
    if (si.endsWith("광역시")) return si.replace("광역시", "");
    if (si.endsWith("특별시")) return si.replace("특별시", "");
    return si.slice(0, -1);
  }

  return address;
}
