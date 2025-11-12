import React, { useState, KeyboardEvent } from "react";
import { Box, Chip, TextField, Typography } from "@mui/material";

export interface HashtagInputProps {
  value?: string[];
  onChange?: (hashtags: string[]) => void;
  error?: string;
  label?: string;
  required?: boolean;
  maxTags?: number;
}

export const HashtagInput: React.FC<HashtagInputProps> = ({
  value = [],
  onChange,
  error,
  label = "해시태그",
  required = false,
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addHashtag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // 백스페이스로 마지막 해시태그 삭제
      removeHashtag(value.length - 1);
    }
  };

  const addHashtag = () => {
    const trimmed = inputValue.trim().replace(/^#/, ""); // # 제거
    if (!trimmed) return;

    if (value.length >= maxTags) {
      return;
    }

    // 중복 체크
    if (value.includes(trimmed)) {
      setInputValue("");
      return;
    }

    const newHashtags = [...value, trimmed];
    onChange?.(newHashtags);
    setInputValue("");
  };

  const removeHashtag = (index: number) => {
    const newHashtags = value.filter((_, i) => i !== index);
    onChange?.(newHashtags);
  };

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1 }} component="label">
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Typography>
      )}

      <TextField
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addHashtag}
        placeholder={`해시태그를 입력하고 Enter 또는 쉼표(,)를 누르세요 (최대 ${maxTags}개)`}
        error={Boolean(error)}
        helperText={error || `${value.length}/${maxTags}개`}
        size="small"
      />

      {value.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {value.map((hashtag, index) => (
            <Chip
              key={index}
              label={`#${hashtag}`}
              onDelete={() => removeHashtag(index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
