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
 * - 없음 / "전지역" → null (필터 미적용, 전지역)
 * - "서울:전지역" → [{ depth1: "서울", depth2: "전지역" }]
 * - "서울:강남,경기:수원" → [{ depth1: "서울", depth2: "강남" }, { depth1: "경기", depth2: "수원" }]
 */
export function parseRegionsParam(regions?: string | null): ParsedRegionPair[] | null {
  const trimmed = regions?.trim();
  if (!trimmed) return null;
  if (trimmed === ALL_REGION_VALUE) return null;

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

/** 주소(address 또는 roadAddress)에 검색어가 포함되는 Prisma 조건 (부분 일치) */
function addressContainsCondition(term: string): Prisma.StoreWhereInput {
  return {
    OR: [
      { address: { contains: term, mode: "insensitive" } },
      { roadAddress: { contains: term, mode: "insensitive" } },
    ],
  };
}

/** 한 쌍(1depth:2depth)에 해당하는 스토어 조건. 2depth가 "전지역"이면 1depth만 검사 */
function buildStoreWhereForOneRegionPair(pair: ParsedRegionPair): Prisma.StoreWhereInput {
  const depth1Condition = addressContainsCondition(pair.depth1.trim());
  if (pair.depth2 === ALL_REGION_VALUE) return depth1Condition;

  return {
    AND: [depth1Condition, addressContainsCondition(pair.depth2.trim())],
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
