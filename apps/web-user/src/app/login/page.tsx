import { Metadata } from "next";
import Link from "next/link";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { Button } from "@/apps/web-user/common/components/buttons/Button";

// 로그인 페이지 전용 SEO 메타데이터(TODO: 추후 수정필요)
export const metadata: Metadata = {
  title: "로그인",
  description:
    "Sweet Order에 로그인하여 달콤한 디저트를 주문하세요. 간편한 로그인으로 다양한 디저트를 만나보세요.",
  keywords: [
    "Sweet Order 로그인",
    "디저트 주문 로그인",
    "온라인 디저트 로그인",
    "케이크 주문 로그인",
  ],
  robots: {
    index: false, // 로그인 페이지는 검색엔진에서 제외
    follow: false,
  },
  openGraph: {
    title: "Sweet Order 로그인",
    description: "Sweet Order에 로그인하여 달콤한 디저트를 주문하세요.",
    type: "website",
    url: `https://sweetorders.com${PATHS.AUTH.LOGIN}`,
  },
};

export default function LoginPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "300px",
        gap: "40px",
      }}
    >
      <h1>로그인</h1>
      <Link href={PATHS.AUTH.LOGIN_BASIC}>
        <Button
          type="button"
          style={{
            width: "500px",
            height: "70px",
            border: "none",
            backgroundColor: "black",
            color: "white",
            fontSize: "16px",
            fontWeight: "700",
          }}
        >
          일반 로그인
        </Button>
      </Link>
      <Button
        type="button"
        style={{
          width: "500px",
          height: "70px",
          border: "none",
          backgroundColor: "#4285F4",
          color: "white",
          fontSize: "16px",
          fontWeight: "700",
        }}
      >
        구글 로그인
      </Button>
    </div>
  );
}
