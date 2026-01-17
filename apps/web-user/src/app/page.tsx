"use client";

// import { Metadata } from "next";
import { useState } from "react";
import { SearchBar } from "@/apps/web-user/common/components/search/SearchBar";
import { Calendar } from "@/apps/web-user/common/components/calendars/Calendar";
import { TimePicker } from "@/apps/web-user/common/components/timepickers/TimePicker";
import { navigateToLoginPage } from "@/apps/web-user/common/utils/webview.bridge";

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
  // 달력 테스트용 상태 선언
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  // 시간 선택 테스트용 상태 선언
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date(2026, 1, 16, 14, 0, 0));

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

      {/* 달력 테스트 (임시) */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          minDate={new Date()}
          initialMonth={new Date(2026, 2, 1)}
        />
      </div>

      {/* 시간 선택 테스트 (임시) */}
      <div
        style={{
          width: "400px",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <TimePicker
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
          interval={30}
          disabledTimes={[new Date(2026, 1, 16, 0, 0, 0), new Date(2026, 1, 16, 0, 30, 0)]}
        />
      </div>

      {/* 기타 콘텐츠 */}
      <div>
        <h1>홈</h1>
      </div>

      {/* 로그인 버튼 (임시) */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "60px",
          marginBottom: "40px",
        }}
      >
        <button
          onClick={() => navigateToLoginPage()}
          style={{
            padding: "14px 32px",
            fontSize: "16px",
            fontWeight: 600,
            color: "#FFFFFF",
            backgroundColor: "#667EEA",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#5568D3";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#667EEA";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
          }}
        >
          로그인
        </button>
      </div>
    </div>
  );
}
