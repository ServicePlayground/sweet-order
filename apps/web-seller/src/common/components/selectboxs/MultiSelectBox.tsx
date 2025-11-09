import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
  Chip,
  Box,
} from "@mui/material";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface MultiSelectBoxProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly SelectOption[];
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const MultiSelectBox: React.FC<MultiSelectBoxProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  fullWidth = true,
  disabled = false,
}) => {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValue = event.target.value;
    onChange(typeof selectedValue === "string" ? selectedValue.split(",") : selectedValue);
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      error={Boolean(error)}
      required={required}
      disabled={disabled}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((val) => {
              const option = options.find((opt) => opt.value === val);
              return <Chip key={val} label={option?.label || val} size="small" />;
            })}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
