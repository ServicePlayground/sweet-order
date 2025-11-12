"use client";

// import { Metadata } from "next";
import { SearchBar } from "@/apps/web-user/common/components/search/SearchBar";

// 홈페이지 전용 SEO 메타데이터(TODO: 추후 수정필요)
// export const metadata: Metadata = {
//   title: "홈",
//   description:
//     "달콤한 디저트를 온라인으로 주문하는 Sweet Order의 메인 페이지. 신선한 케이크, 쿠키, 마카롱 등 다양한 디저트를 만나보세요.",
//   keywords: [
//     "디저트 주문",
//     "케이크 주문",
//     "온라인 디저트",
//     "디저트 배달",
//     "Sweet Order",
//     "달콤한 디저트",
//     "디저트 플랫폼",
//     "케이크 배달",
//   ],
//   openGraph: {
//     title: "Sweet Order - 달콤한 디저트 주문 플랫폼",
//     description:
//       "달콤한 디저트를 온라인으로 주문하는 최고의 플랫폼. 신선한 케이크, 쿠키, 마카롱 등 다양한 디저트를 집에서 편리하게 주문하세요.",
//     type: "website",
//     url: "https://sweetorders.com",
//     images: [
//       {
//         url: "/home-og-image.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Sweet Order 홈페이지 - 달콤한 디저트 주문",
//       },
//     ],
//   },
// };

export default function Home() {
  return (
    <div
      style={{
        width: "100%",
        padding: "40px 20px",
      }}
    >
      {/* 검색 바 */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "100%" }}>
          <SearchBar placeholder="상품을 검색해보세요" />
        </div>
      </div>

      {/* 기타 콘텐츠 */}
      <div>
        <h1>홈</h1>
      </div>
    </div>
  );
}
