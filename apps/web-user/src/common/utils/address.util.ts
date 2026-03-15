/**
 * 전체 주소에서 시/군/구를 추출 후 접미사를 제거합니다.
 * 구 > 군 > 시 순서로 우선 추출합니다.
 * @example "서울특별시 서초구 XX동" → "서초"
 * @example "경기도 가평군 XX읍" → "가평"
 * @example "경기도 수원시 XX동" → "수원"
 * @example "세종특별자치시 XX동" → "세종"
 */
/**
 * 주소를 구/군/읍/면/리 단위까지만 표시합니다.
 * @example "서울특별시 서초구 반포동 123" → "서울특별시 서초구"
 * @example "경기도 가평군 청평면 XX리" → "경기도 가평군 청평면"
 */
export function shortenAddress(address: string): string {
  const parts = address.split(" ");
  for (let i = 0; i < parts.length; i++) {
    if (/[구군읍면리]$/.test(parts[i])) {
      return parts.slice(0, i + 1).join(" ");
    }
  }
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].endsWith("시")) {
      return parts.slice(0, i + 1).join(" ");
    }
  }
  return address;
}

/**
 * 주소를 시/구/동 단위까지 축약합니다.
 * 광역시/특별시는 짧은 형태로 변환합니다.
 * @example "서울특별시 강남구 역삼동 456-789" → "서울시 강남구 역삼동"
 * @example "경기도 수원시 영통구 매탄동 123" → "수원시 영통구 매탄동"
 * @example "서울특별시 서초구 잠원동 123-456" → "서울시 서초구 잠원동"
 * @example "서울특별시 강남구" → "서울시 강남구"
 */
export function formatAddressToDistrict(address: string): string {
  const parts = address.split(" ");

  // 광역시/특별시 축약
  const shortened = parts.map((part) => {
    if (part.endsWith("특별시")) return part.replace("특별시", "시");
    if (part.endsWith("광역시")) return part.replace("광역시", "시");
    if (part.endsWith("특별자치시")) return part.replace("특별자치시", "시");
    if (part.endsWith("특별자치도")) return part.replace("특별자치도", "도");
    return part;
  });

  // 동/읍/면/리까지 포함
  for (let i = 0; i < shortened.length; i++) {
    if (/[동읍면리]$/.test(shortened[i]) && !shortened[i].endsWith("도")) {
      return shortened.slice(0, i + 1).join(" ");
    }
  }

  // 동이 없으면 구/군까지
  for (let i = 0; i < shortened.length; i++) {
    if (/[구군]$/.test(shortened[i])) {
      return shortened.slice(0, i + 1).join(" ");
    }
  }

  // 시까지
  for (let i = 0; i < shortened.length; i++) {
    if (shortened[i].endsWith("시")) {
      return shortened.slice(0, i + 1).join(" ");
    }
  }

  return shortened.join(" ");
}

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
