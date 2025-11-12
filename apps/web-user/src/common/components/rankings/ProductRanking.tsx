"use client";

interface ProductRankingItem {
  rank: number;
  name: string;
  imageUrl?: string;
  price?: number;
  originalPrice?: number;
  likeCount?: number;
  storeName?: string;
}

interface ProductRankingProps {
  items?: ProductRankingItem[];
}

/* 임시 컴포넌트 */
export function ProductRanking({ items }: ProductRankingProps) {
  // 임시 이미지 URL
  const defaultImageUrl =
    "https://static-staging.sweetorders.com/uploads/1__1762512563333_036e4556.jpeg";

  // 기본 더미 데이터 (1~10위)
  const defaultItems: ProductRankingItem[] = [
    {
      rank: 1,
      name: "상품 1위",
      imageUrl: defaultImageUrl,
      price: 25000,
      originalPrice: 30000,
      likeCount: 1234,
      storeName: "달콤한 디저트샵",
    },
    {
      rank: 2,
      name: "상품 2위",
      imageUrl: defaultImageUrl,
      price: 18000,
      originalPrice: 22000,
      likeCount: 987,
      storeName: "스위트 오더",
    },
    {
      rank: 3,
      name: "상품 3위",
      imageUrl: defaultImageUrl,
      price: 32000,
      originalPrice: 35000,
      likeCount: 856,
      storeName: "케이크 하우스",
    },
    {
      rank: 4,
      name: "상품 4위",
      imageUrl: defaultImageUrl,
      price: 15000,
      originalPrice: 18000,
      likeCount: 743,
      storeName: "디저트 파라다이스",
    },
    {
      rank: 5,
      name: "상품 5위",
      imageUrl: defaultImageUrl,
      price: 22000,
      originalPrice: 25000,
      likeCount: 692,
      storeName: "달콤한 시간",
    },
    {
      rank: 6,
      name: "상품 6위",
      imageUrl: defaultImageUrl,
      price: 19000,
      originalPrice: 21000,
      likeCount: 567,
      storeName: "스위트 랜드",
    },
    {
      rank: 7,
      name: "상품 7위",
      imageUrl: defaultImageUrl,
      price: 28000,
      originalPrice: 30000,
      likeCount: 534,
      storeName: "디저트 스튜디오",
    },
    {
      rank: 8,
      name: "상품 8위",
      imageUrl: defaultImageUrl,
      price: 16000,
      originalPrice: 19000,
      likeCount: 489,
      storeName: "케이크 마스터",
    },
    {
      rank: 9,
      name: "상품 9위",
      imageUrl: defaultImageUrl,
      price: 24000,
      originalPrice: 27000,
      likeCount: 432,
      storeName: "달콤한 선택",
    },
    {
      rank: 10,
      name: "상품 10위",
      imageUrl: defaultImageUrl,
      price: 17000,
      originalPrice: 20000,
      likeCount: 398,
      storeName: "스위트 드림",
    },
  ];

  const rankingItems = items || defaultItems;

  // 랭킹별 스타일 설정
  const getRankStyle = (rank: number) => {
    if (rank === 1) {
      return {
        badgeBg: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
        badgeColor: "#FFFFFF",
        badgeShadow: "0 4px 12px rgba(255, 215, 0, 0.4)",
        itemBg: "linear-gradient(135deg, #FFF9E6 0%, #FFF4D6 100%)",
        borderColor: "#FFD700",
        icon: "🥇",
      };
    } else if (rank === 2) {
      return {
        badgeBg: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)",
        badgeColor: "#FFFFFF",
        badgeShadow: "0 4px 12px rgba(192, 192, 192, 0.4)",
        itemBg: "linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)",
        borderColor: "#C0C0C0",
        icon: "🥈",
      };
    } else if (rank === 3) {
      return {
        badgeBg: "linear-gradient(135deg, #CD7F32 0%, #B87333 100%)",
        badgeColor: "#FFFFFF",
        badgeShadow: "0 4px 12px rgba(205, 127, 50, 0.4)",
        itemBg: "linear-gradient(135deg, #FDF5E6 0%, #FAEBD7 100%)",
        borderColor: "#CD7F32",
        icon: "🥉",
      };
    } else {
      return {
        badgeBg: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
        badgeColor: "#FFFFFF",
        badgeShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
        itemBg: "transparent",
        borderColor: "#E5E7EB",
        icon: null,
      };
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        marginBottom: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
          }}
        >
          🏆 실시간 인기 상품 랭킹
        </h2>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
          border: "2px solid #E5E7EB",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        {rankingItems.map((item, index) => {
          const rankStyle = getRankStyle(item.rank);
          const isTopThree = item.rank <= 3;

          return (
            <div
              key={item.rank}
              className="ranking-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: isTopThree ? "12px 16px" : "10px 14px",
                borderRadius: "12px",
                background: rankStyle.itemBg,
                border: isTopThree ? `2px solid ${rankStyle.borderColor}` : "1px solid #E5E7EB",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                animationDelay: `${index * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                e.currentTarget.style.boxShadow = isTopThree
                  ? `0 12px 32px ${rankStyle.badgeShadow}`
                  : "0 8px 24px rgba(0, 0, 0, 0.12)";
                e.currentTarget.style.borderColor = isTopThree ? rankStyle.borderColor : "#667EEA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = isTopThree ? rankStyle.borderColor : "#E5E7EB";
              }}
            >
              {/* 랭킹 배지 */}
              <div
                style={{
                  minWidth: isTopThree ? "40px" : "36px",
                  height: isTopThree ? "40px" : "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: rankStyle.badgeBg,
                  color: rankStyle.badgeColor,
                  fontSize: isTopThree ? "16px" : "13px",
                  fontWeight: 800,
                  boxShadow: rankStyle.badgeShadow,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {rankStyle.icon ? (
                  <span style={{ fontSize: isTopThree ? "20px" : "18px" }}>{rankStyle.icon}</span>
                ) : (
                  item.rank
                )}
              </div>

              {/* 상품 이미지 */}
              {item.imageUrl && (
                <div
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: isTopThree ? `2px solid ${rankStyle.borderColor}` : "2px solid #E5E7EB",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: isTopThree ? "60px" : "56px",
                      height: isTopThree ? "60px" : "56px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {isTopThree && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${rankStyle.borderColor}15 0%, transparent 100%)`,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              )}

              {/* 상품 정보 영역 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  minWidth: 0,
                }}
              >
                {/* 상품명 */}
                <div
                  style={{
                    fontSize: isTopThree ? "16px" : "15px",
                    color: "#111827",
                    fontWeight: isTopThree ? 700 : 600,
                    letterSpacing: "-0.02em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>

                {/* 스토어명 */}
                {item.storeName && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.storeName}
                  </div>
                )}
              </div>

              {/* 오른쪽 정보 영역 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "6px",
                  minWidth: "120px",
                }}
              >
                {/* 가격 정보 */}
                {item.price && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "4px",
                    }}
                  >
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#9ca3af",
                            textDecoration: "line-through",
                          }}
                        >
                          {item.originalPrice.toLocaleString()}원
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#ef4444",
                            fontWeight: 600,
                            backgroundColor: "#fee2e2",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {Math.round(
                            ((item.originalPrice - item.price) / item.originalPrice) * 100,
                          )}
                          % 할인
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: isTopThree ? "20px" : "18px",
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {item.price.toLocaleString()}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                        }}
                      >
                        원
                      </span>
                    </div>
                  </div>
                )}

                {/* 좋아요 수 */}
                {item.likeCount !== undefined && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>❤️</span>
                    <span style={{ fontWeight: 500 }}>{item.likeCount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* 상위 3위 장식 요소 */}
              {isTopThree && (
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${rankStyle.borderColor}20 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
