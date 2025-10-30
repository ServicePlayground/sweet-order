import React from "react";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
  type SxProps,
  type StepperProps,
} from "@mui/material";

interface Props {
  activeStep: number; // 0-based index
  steps: Array<React.ReactNode>;
  title?: React.ReactNode;
  alternativeLabel?: boolean;
  containerSx?: SxProps;
  stepperProps?: StepperProps;
}

export const ProgressBar: React.FC<Props> = ({
  activeStep,
  steps,
  title = "",
  alternativeLabel = true,
  containerSx,
  stepperProps,
}) => {
  return (
    <Box sx={{ mb: 3, ...containerSx }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      <Stepper activeStep={activeStep} alternativeLabel={alternativeLabel} {...stepperProps}>
        {steps.map((label, idx) => (
          <Step key={idx}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
