import React, { useMemo } from "react";
import { Box } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
