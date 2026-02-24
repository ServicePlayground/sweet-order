import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFeedDetail } from "@/apps/web-seller/features/feed/hooks/queries/useFeedQuery";
import {
  useUpdateFeed,
  useDeleteFeed,
} from "@/apps/web-seller/features/feed/hooks/mutations/useFeedMutation";
import type { UpdateFeedRequestDto } from "@/apps/web-seller/features/feed/types/feed.dto";
import { Card, CardContent } from "@/apps/web-seller/common/components/cards/Card";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { BaseInput as Input } from "@/apps/web-seller/common/components/inputs/BaseInput";
import { Label } from "@/apps/web-seller/common/components/labels/Label";
import { RichTextEditor } from "@/apps/web-seller/common/components/editors/RichTextEditor";

export const StoreDetailFeedDetailPage: React.FC = () => {
  const { storeId, feedId } = useParams<{ storeId: string; feedId: string }>();
  const updateFeedMutation = useUpdateFeed();
  const deleteFeedMutation = useDeleteFeed();

  const { data: feed, isLoading } = useFeedDetail(storeId || "", feedId || "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  // 피드 데이터 로드 시 폼 초기화
  React.useEffect(() => {
    if (feed) {
      setTitle(feed.title);
      setContent(feed.content);
    }
  }, [feed]);

  if (!storeId || !feedId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어 또는 피드가 선택되지 않았습니다.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!feed) {
    return (
      <div>
        <h2 className="text-xl font-semibold">피드를 찾을 수 없습니다.</h2>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    let isValid = true;
    if (!title.trim()) {
      setTitleError("제목을 입력해주세요.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!content.trim() || content.trim() === "<p><br></p>") {
      setContentError("내용을 입력해주세요.");
      isValid = false;
    } else {
      setContentError("");
    }

    if (!isValid) return;

    const request: UpdateFeedRequestDto = {
      title: title.trim(),
      content,
    };

    await updateFeedMutation.mutateAsync({ storeId, feedId, request });
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 이 피드를 삭제하시겠습니까?")) {
      return;
    }

    await deleteFeedMutation.mutateAsync({ feedId, storeId });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">피드 수정</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError("");
                }}
                placeholder="피드 제목을 입력해주세요"
                className={titleError ? "border-destructive" : ""}
              />
              {titleError && <p className="text-sm text-destructive">{titleError}</p>}
            </div>

            {/* 내용 */}
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <RichTextEditor
                value={content}
                onChange={(value) => {
                  setContent(value);
                  if (contentError) setContentError("");
                }}
                placeholder="피드 내용을 입력해주세요. 이미지, 텍스트, 링크 등을 활용하여 작성할 수 있습니다."
                minHeight={400}
                error={!!contentError}
              />
              {contentError && <p className="text-sm text-destructive">{contentError}</p>}
            </div>

            {/* 버튼 */}
            <div className="flex justify-center gap-4 pt-6">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteFeedMutation.isPending || updateFeedMutation.isPending}
              >
                삭제하기
              </Button>
              <Button type="submit" disabled={updateFeedMutation.isPending}>
                {updateFeedMutation.isPending ? "수정 중..." : "수정하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
