import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IFeed } from "@/apps/web-seller/features/feed/types/feed.type";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { formatRelativeTime } from "@/apps/web-seller/common/utils/date.util";
import { Card, CardContent } from "@/apps/web-seller/common/components/@shadcn-ui/card";

interface FeedListProps {
  feeds: IFeed[];
}

export const FeedList: React.FC<FeedListProps> = ({ feeds }) => {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();

  if (feeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>등록된 피드가 없습니다.</p>
      </div>
    );
  }

  const handleFeedClick = (feedId: string) => {
    if (storeId) {
      navigate(ROUTES.STORE_DETAIL_FEED_DETAIL(storeId, feedId));
    }
  };

  return (
    <div className="space-y-4">
      {feeds.map((feed) => {
        // 날짜 필드를 Date 객체로 변환
        const createdAt =
          feed.createdAt instanceof Date ? feed.createdAt : new Date(feed.createdAt);

        return (
          <Card
            key={feed.id}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => handleFeedClick(feed.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{feed.title}</h3>
                  <div
                    className="text-sm text-muted-foreground line-clamp-2 mb-3"
                    dangerouslySetInnerHTML={{
                      __html: feed.content.replace(/<[^>]*>/g, "").substring(0, 100),
                    }}
                  />
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatRelativeTime(createdAt)}</span>
                  </div>
                </div>
                {feed.storeLogoImageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={feed.storeLogoImageUrl}
                      alt="스토어 로고"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
