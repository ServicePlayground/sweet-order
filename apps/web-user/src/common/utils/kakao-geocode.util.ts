interface RegionDocument {
  region_type: "B" | "H";
  region_1depth_name: string; // 시/도
  region_2depth_name: string; // 구/군
  region_3depth_name: string; // 동
}

interface KakaoRegionResponse {
  documents: RegionDocument[];
}

/**
 * Next.js API Route(/api/geocode)를 통해 좌표를 지역명으로 변환
 * "시/도 구" 형태의 문자열을 반환 (예: "서울특별시 강남구")
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const response = await fetch(
      `/api/geocode?latitude=${latitude}&longitude=${longitude}`,
    );

    if (!response.ok) {
      console.error("역지오코딩 API 호출 실패:", response.status);
      return null;
    }

    const data: KakaoRegionResponse = await response.json();

    // region_type "B"(법정동)를 우선 사용
    const region =
      data.documents.find((doc) => doc.region_type === "B") ?? data.documents[0];

    if (!region) {
      return null;
    }

    return `${region.region_1depth_name} ${region.region_2depth_name}`;
  } catch (error) {
    console.error("역지오코딩 중 오류가 발생했습니다:", error);
    return null;
  }
}
