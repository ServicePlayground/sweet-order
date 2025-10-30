import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { ProgressBar } from "@/apps/web-seller/common/components/progressbars/progressbar";
import { BusinessRegistrationForm } from "@/apps/web-seller/features/business/components/forms/BusinessRegistrationForm";

export const StoreCreatePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const onSubmitStep1 = () => {
    setCurrentStep(2);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessRegistrationForm onSubmit={onSubmitStep1} />;
      case 2:
        return <>step2</>;
      case 3:
        return <>step3</>;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        스토어 만들기
      </Typography>
      <ProgressBar activeStep={currentStep - 1} steps={["사업자 정보", "추가 정보", "검토/완료"]} />

      <Paper sx={{ p: 3 }}>{renderStep()}</Paper>
    </Box>
  );
};
