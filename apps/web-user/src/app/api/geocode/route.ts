import { NextRequest, NextResponse } from "next/server";

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY || "";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  if (!latitude || !longitude) {
    return NextResponse.json({ error: "latitude, longitude 파라미터가 필요합니다." }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("카카오 API 호출 실패:", response.status, errorData);
      return NextResponse.json(
        { error: "카카오 API 호출 실패", status: response.status, detail: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("역지오코딩 API 오류:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
