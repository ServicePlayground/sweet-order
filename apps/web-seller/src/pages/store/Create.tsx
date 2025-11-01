import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { ProgressBar } from "@/apps/web-seller/common/components/progressbars/progressbar";
import { BusinessRegistrationForm } from "@/apps/web-seller/features/business/components/forms/BusinessRegistrationForm";
import { OnlineTradingCompanyDetailForm } from "@/apps/web-seller/features/business/components/forms/OnlineTradingCompanyDetailForm";
import {
  IBusinessRegistrationForm,
  IBusinessRegistrationResponse,
  IOnlineTradingCompanyDetailForm,
  IOnlineTradingCompanyDetailResponse,
} from "@/apps/web-seller/features/business/types/business.type";
import {
  useGetOnlineTradingCompanyDetail,
  useVerifyBusinessRegistration,
} from "@/apps/web-seller/features/business/hooks/queries/useBusiness";
import { defaultForm as defaultBusinessRegistrationForm } from "@/apps/web-seller/features/business/components/forms/BusinessRegistrationForm";
import { defaultForm as defaultOnlineTradingCompanyDetailForm } from "@/apps/web-seller/features/business/components/forms/OnlineTradingCompanyDetailForm";

interface StepData {
  businessRegistrationForm: IBusinessRegistrationForm;
  businessRegistrationResponse: IBusinessRegistrationResponse | null;
  onlineTradingCompanyDetailForm: IOnlineTradingCompanyDetailForm;
  onlineTradingCompanyDetailResponse: IOnlineTradingCompanyDetailResponse | null;
}

const TOTAL_STEPS = 3;
const STEPS = ["사업자 정보 등록", "통신판매사업자 정보 등록", "검토/완료"];

export const StoreCreatePage: React.FC = () => {
  const verifyBusinessRegistrationMutation = useVerifyBusinessRegistration();
  const getOnlineTradingCompanyDetailMutation = useGetOnlineTradingCompanyDetail();

  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    businessRegistrationForm: defaultBusinessRegistrationForm,
    businessRegistrationResponse: null,
    onlineTradingCompanyDetailForm: defaultOnlineTradingCompanyDetailForm,
    onlineTradingCompanyDetailResponse: null,
  });

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmitStep1 = async (data: IBusinessRegistrationForm) => {
    const response = await verifyBusinessRegistrationMutation.mutateAsync(data);
    setStepData((prev) => ({
      ...prev,
      businessRegistrationForm: data,
      businessRegistrationResponse: response,
    }));
    handleNextStep();
  };

  const handleSubmitStep2 = async (data: IOnlineTradingCompanyDetailForm) => {
    const response = await getOnlineTradingCompanyDetailMutation.mutateAsync({
      brno: stepData.businessRegistrationResponse?.response.b_no || "",
      prmmiMnno: data.prmmiMnno,
    });
    setStepData((prev) => ({
      ...prev,
      onlineTradingCompanyDetailForm: data,
      onlineTradingCompanyDetailResponse: response,
    }));
    handleNextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessRegistrationForm
            onSubmit={handleSubmitStep1}
            initialValue={stepData.businessRegistrationForm}
          />
        );
      case 2:
        return (
          <OnlineTradingCompanyDetailForm
            onSubmit={handleSubmitStep2}
            onPrevious={handlePreviousStep}
            initialValue={stepData.onlineTradingCompanyDetailForm}
          />
        );
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
      <ProgressBar activeStep={currentStep - 1} steps={STEPS} />

      <Paper sx={{ p: 3 }}>{renderStep()}</Paper>
    </Box>
  );
};
