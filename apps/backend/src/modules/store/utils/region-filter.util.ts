import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/** 전지역을 의미하는 값 (regions 파라미터 단독 또는 2depth) */
const ALL_REGION_VALUE = "전지역";

/** 파싱된 지역 조건 한 건 (1depth:2depth) */
export interface ParsedRegionPair {
  depth1: string;
  depth2: string;
}

/**
 * regions 쿼리 파라미터 파싱
 * - 없음 / "전지역" / "전지역:전지역" → null (필터 미적용, 전지역)
 * - "서울:전지역" → [{ depth1: "서울", depth2: "전지역" }]
 * - "서울:강남,경기:수원" → [{ depth1: "서울", depth2: "강남" }, { depth1: "경기", depth2: "수원" }]
 */
export function parseRegionsParam(regions?: string | null): ParsedRegionPair[] | null {
  const trimmed = regions?.trim();
  if (!trimmed) return null;
  // 전지역, 전지역:전지역 → 전역(필터 미적용)으로 처리
  if (trimmed === ALL_REGION_VALUE || trimmed === `${ALL_REGION_VALUE}:${ALL_REGION_VALUE}`) {
    return null;
  }

  const pairs: ParsedRegionPair[] = [];
  const parts = trimmed
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    const colonIndex = part.indexOf(":");
    if (colonIndex === -1) {
      if (part === ALL_REGION_VALUE) continue;
      continue;
    }
    const depth1 = part.slice(0, colonIndex).trim();
    const depth2 = part.slice(colonIndex + 1).trim();
    if (depth1 && depth2) {
      pairs.push({ depth1, depth2 });
    }
  }

  return pairs.length > 0 ? pairs : null;
}

/** 주소(address 또는 roadAddress)에 단일 검색어가 포함되는 Prisma 조건 (부분 일치) */
function addressContainsCondition(term: string): Prisma.StoreWhereInput {
  const trimmed = term.trim();
  return {
    OR: [
      { address: { contains: trimmed, mode: "insensitive" } },
      { roadAddress: { contains: trimmed, mode: "insensitive" } },
    ],
  };
}

/**
 * 주소(address 또는 roadAddress)에 하나 이상의 검색어가 포함되는 Prisma 조건 (부분 일치)
 * - terms 중 하나라도 포함되면 매칭
 * - terms가 모두 공백이면 null 반환
 */
function buildAddressContainsCondition(terms: string[]): Prisma.StoreWhereInput | null {
  const normalized = terms.map((term) => term.trim()).filter((term) => term.length > 0);

  if (normalized.length === 0) return null;
  if (normalized.length === 1) return addressContainsCondition(normalized[0]);

  return {
    OR: normalized.map((term) => addressContainsCondition(term)),
  };
}

/** 한 쌍(1depth:2depth)에 해당하는 스토어 조건. 2depth가 "전지역"이면 1depth만 검사 */
function buildStoreWhereForOneRegionPair(pair: ParsedRegionPair): Prisma.StoreWhereInput {
  const depth1Condition = buildAddressContainsCondition([pair.depth1]) ?? {};
  if (pair.depth2 === ALL_REGION_VALUE) return depth1Condition;

  const depth2Condition = buildAddressContainsCondition([pair.depth2]);
  if (!depth2Condition) return depth1Condition;

  return {
    AND: [depth1Condition, depth2Condition],
  };
}

/**
 * 파싱된 지역 목록으로 스토어 목록/상품 목록용 StoreWhereInput 생성
 * 여러 쌍은 OR 조건 (해당 지역 중 하나라도 만족하면 포함)
 */
export function buildStoreWhereInputForRegions(
  parsed: ParsedRegionPair[] | null,
): Prisma.StoreWhereInput | null {
  if (!parsed || parsed.length === 0) return null;
  if (parsed.length === 1) return buildStoreWhereForOneRegionPair(parsed[0]);
  return {
    OR: parsed.map((p) => buildStoreWhereForOneRegionPair(p)),
  };
}

/**
 * 1depth·2depth 검색 키워드로 스토어 조건 생성
 * 지역별 스토어 수 집계용. depth2Keywords가 비어 있으면 "전지역"(1depth만 매칭)
 */
export function buildStoreWhereForRegionKeywords(
  depth1Keywords: string[],
  depth2Keywords: string[],
): Prisma.StoreWhereInput {
  const depth1Condition = buildAddressContainsCondition(depth1Keywords) ?? {};
  if (depth2Keywords.length === 0) {
    return depth1Condition;
  }

  const depth2Condition = buildAddressContainsCondition(depth2Keywords);
  if (!depth2Condition) {
    return depth1Condition;
  }

  // 양쪽 조건이 모두 존재하면 AND, 한쪽만 있으면 그 조건만 사용
  if (Object.keys(depth1Condition).length === 0) return depth2Condition;
  return { AND: [depth1Condition, depth2Condition] };
}
