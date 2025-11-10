import React, { useMemo, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useUploadFile } from "@/apps/web-seller/features/upload/hooks/queries/useUpload";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  error?: boolean;
}

// 리치 텍스트 에디터 공용 컴포넌트
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "내용을 입력해주세요.",
  minHeight = 400,
  error = false,
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const uploadMutation = useUploadFile();

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    }),
    [],
  );

  // 이미지 핸들러 설정
  useEffect(() => {
    // quill이 준비될 때까지 약간의 지연
    const timer = setTimeout(() => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const toolbar = quill.getModule("toolbar");
      if (!toolbar) return;

      // 이미지 핸들러 커스터마이징
      toolbar.addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.style.display = "none";
        document.body.appendChild(input);
        input.click();

        input.onchange = () => {
          const file = input.files?.[0];
          document.body.removeChild(input);

          if (!file) return;

          // 비동기 처리
          (async () => {
            try {
              // 이미지 업로드
              const response = await uploadMutation.mutateAsync(file);
              const imageUrl = response.fileUrl;

              // Quill 에디터에 이미지 삽입
              const editor = quillRef.current?.getEditor();
              if (!editor) return;

              // 에디터에 포커스가 없으면 포커스를 주고 끝에 커서 설정
              let range = editor.getSelection();
              const length = editor.getLength();

              if (!range) {
                // 선택 영역이 없으면 끝에 커서 설정
                editor.focus();
                editor.setSelection(length - 1, 0);
                range = editor.getSelection(true);
              } else {
                range = editor.getSelection(true);
              }

              if (range) {
                editor.insertEmbed(range.index, "image", imageUrl);
                editor.setSelection(range.index + 1, 0);
              }
            } catch (error) {
              console.error("이미지 업로드 실패:", error);
            }
          })();
        };
      });
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [uploadMutation]);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "color",
    "background",
  ];

  return (
    <Box
      sx={{
        "& .quill": {
          "& .ql-toolbar": {
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
            borderColor: error ? "error.main" : "divider",
            backgroundColor: "grey.50",
          },
          "& .ql-container": {
            minHeight: `${minHeight}px`,
            fontSize: "16px",
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
            borderColor: error ? "error.main" : "divider",
            "& .ql-editor": {
              minHeight: `${minHeight}px`,
              "&.ql-blank::before": {
                content: `"${placeholder}"`,
                color: "text.disabled",
                fontStyle: "normal",
              },
            },
          },
        },
      }}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </Box>
  );
};
