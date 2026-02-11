"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Feed } from "@/apps/web-user/features/feed/types/feed.type";
import { useStoreFeeds } from "@/apps/web-user/features/feed/hooks/queries/useStoreFeeds";
import DOMPurify from "dompurify";

interface StoreDetailFeedSectionProps {
  storeId: string;
}

interface FeedItemProps {
  feed: Feed;
}

// HTML에서 이미지 URL 추출
function extractImagesFromHtml(html: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }
  return images;
}

// HTML 엔티티 디코딩 (브라우저 내장 방식)
function decodeHtmlEntities(text: string): string {
  if (typeof document === "undefined") return text;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

// HTML에서 텍스트만 추출
function extractTextFromHtml(html: string): string {
  // 태그 제거
  const withoutTags = html.replace(/<[^>]*>/g, " ");
  // HTML 엔티티 디코딩
  const decoded = decodeHtmlEntities(withoutTags);
  // 연속 공백 제거 및 트림
  return decoded.replace(/\s+/g, " ").trim();
}

function FeedItem({ feed }: FeedItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  // HTML에서 이미지와 텍스트 추출
  const sanitizedHtml = DOMPurify.sanitize(feed.content);
  const images = extractImagesFromHtml(sanitizedHtml);
  const textContent = extractTextFromHtml(sanitizedHtml);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [textContent]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="py-[20px]">
      {/* 헤더: 로고 + 제목 + 날짜 */}
      <div className="flex items-center gap-[10px] mb-[12px]">
        {feed.storeLogoImageUrl ? (
          <div className="w-[32px] h-[32px] relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={feed.storeLogoImageUrl}
              alt="스토어 로고"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-[32px] h-[32px] rounded-full bg-gray-200 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{feed.title}</h3>
          <p className="text-2sm text-gray-500">{formatDate(feed.createdAt)}</p>
        </div>
      </div>

      {/* 이미지 */}
      {images.length > 0 && (
        <div className="mb-[12px] rounded-lg overflow-hidden">
          <Image
            src={images[0]}
            alt={feed.title}
            width={600}
            height={400}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </div>
      )}

      {/* 텍스트 내용 */}
      {textContent && (
        <div>
          <p
            ref={contentRef}
            className={`text-sm text-gray-700 leading-[145%] ${!isExpanded ? "line-clamp-4" : ""}`}
          >
            {textContent}
          </p>
          {isTruncated && !isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="text-sm text-gray-500 mt-1"
            >
              더보기
            </button>
          )}
          {isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-sm text-gray-500 mt-1"
            >
              접기
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function StoreDetailFeedSection({ storeId }: StoreDetailFeedSectionProps) {
  const { data: feedData, isLoading } = useStoreFeeds({ storeId });

  if (isLoading) {
    return <></>;
  }

  if (!feedData?.data || feedData.data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        등록된 피드가 없습니다.
      </div>
    );
  }

  return (
    <div>
      {feedData.data.map((feed) => (
        <FeedItem key={feed.id} feed={feed} />
      ))}
    </div>
  );
}
