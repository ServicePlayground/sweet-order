"use client";

import { useState, useEffect } from "react";

// 기본 더미 데이터
const defaultItems = [
  {
    id: "1",
    imageUrl: "images/banner/sweetorder-open-banner1.png",
    title: "생일 케이크 주문",
    description: "특별한 날을 더 특별하게",
  },
  {
    id: "2",
    imageUrl: "images/banner/sweetorder-open-banner2.png",
    title: "생일 케이크 주문",
    description: "특별한 날을 더 특별하게",
  },
  {
    id: "3",
    imageUrl: "images/banner/sweetorder-open-banner3.png",
    title: "생일 케이크 주문",
    description: "특별한 날을 더 특별하게",
  },
];

// 16:9 비율의 이미지 배너 슬라이더
export function ImageBannerSlider() {
  const sliderItems = defaultItems;
  const [currentIndex, setCurrentIndex] = useState(0);

  // 자동 슬라이드
  useEffect(() => {
    if (sliderItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderItems.length]);

  // 이전 슬라이드
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
  };

  // 다음 슬라이드
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
  };

  // 특정 인덱스로 이동
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        marginBottom: "40px",
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* 슬라이더 컨테이너 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "500px",
          // aspectRatio: "16 / 9",
          overflow: "hidden",
          borderRadius: "20px",
        }}
      >
        {/* 이미지 슬라이드 */}
        <div
          style={{
            display: "flex",
            width: `${sliderItems.length * 100}%`,
            height: "100%",
            transform: `translateX(-${currentIndex * (100 / sliderItems.length)}%)`,
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {sliderItems.map((item) => (
            <div
              key={item.id}
              style={{
                width: `${100 / sliderItems.length}%`,
                height: "100%",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.title || "슬라이드 이미지"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {/* 그라데이션 오버레이 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%)",
                }}
              />
              {/* 텍스트 오버레이 */}
              {(item.title || item.description) && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "40px",
                    left: "40px",
                    right: "40px",
                    color: "#FFFFFF",
                    zIndex: 2,
                  }}
                >
                  {item.title && (
                    <h3
                      style={{
                        fontSize: "32px",
                        fontWeight: 800,
                        marginBottom: "12px",
                        textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 500,
                        textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                        opacity: 0.95,
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 인디케이터 (점 표시) */}
        {sliderItems.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "8px",
              zIndex: 3,
            }}
          >
            {sliderItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: currentIndex === index ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  background:
                    currentIndex === index
                      ? "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
                      : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                }}
                onMouseEnter={(e) => {
                  if (currentIndex !== index) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentIndex !== index) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
