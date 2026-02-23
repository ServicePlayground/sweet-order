import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateFeed } from "@/apps/web-seller/features/feed/hooks/mutations/useFeedMutation";
import type { CreateFeedRequestDto } from "@/apps/web-seller/features/feed/types/feed.dto";
import { Card, CardContent } from "@/apps/web-seller/common/components/cards/Card";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { BaseInput as Input } from "@/apps/web-seller/common/components/inputs/BaseInput";
import { Label } from "@/apps/web-seller/common/components/labels/Label";
import { RichTextEditor } from "@/apps/web-seller/common/components/editors/RichTextEditor";

export const StoreDetailFeedCreatePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const createFeedMutation = useCreateFeed();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  if (!storeId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어가 선택되지 않았습니다.</h2>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    const request: CreateFeedRequestDto = {
      storeId,
      title: title.trim(),
      content,
    };

    await createFeedMutation.mutateAsync({ storeId, request });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">피드 등록</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Button type="submit" disabled={createFeedMutation.isPending}>
                {createFeedMutation.isPending ? "등록 중..." : "등록하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
