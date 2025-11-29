import React, { useState } from "react";
import { Card, CardContent } from "@/apps/web-seller/common/components/@shadcn-ui/card";
import { ProgressBar } from "@/apps/web-seller/common/components/progressbars/progressbar";
import { BusinessRegistrationForm } from "@/apps/web-seller/features/business/components/forms/BusinessRegistrationForm";
import { OnlineTradingCompanyDetailForm } from "@/apps/web-seller/features/business/components/forms/OnlineTradingCompanyDetailForm";
import { StoreCreationForm } from "@/apps/web-seller/features/store/components/forms/StoreCreationForm";
import {
  IBusinessRegistrationForm,
  IOnlineTradingCompanyDetailForm,
} from "@/apps/web-seller/features/business/types/business.type";
import { IStoreForm } from "@/apps/web-seller/features/store/types/store.type";
import {
  useGetOnlineTradingCompanyDetail,
  useVerifyBusinessRegistration,
} from "@/apps/web-seller/features/business/hooks/queries/useBusiness";
import { useCreateStore } from "@/apps/web-seller/features/store/hooks/queries/useStore";
import { defaultForm as defaultBusinessRegistrationForm } from "@/apps/web-seller/features/business/components/forms/BusinessRegistrationForm";
import { defaultForm as defaultOnlineTradingCompanyDetailForm } from "@/apps/web-seller/features/business/components/forms/OnlineTradingCompanyDetailForm";
import { defaultForm as defaultStoreForm } from "@/apps/web-seller/features/store/components/forms/StoreCreationForm";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import { BUSINESS_ERROR_MESSAGES } from "@/apps/web-seller/features/business/constants/business.constant";

interface StepData {
  businessRegistrationForm: IBusinessRegistrationForm;
  onlineTradingCompanyDetailForm: IOnlineTradingCompanyDetailForm;
  storeForm: IStoreForm;
}

const TOTAL_STEPS = 3;
const STEPS = ["사업자 정보 등록", "통신판매사업자 정보 등록", "스토어 정보 입력"];

export const StoreCreatePage: React.FC = () => {
  const verifyBusinessRegistrationMutation = useVerifyBusinessRegistration();
  const getOnlineTradingCompanyDetailMutation = useGetOnlineTradingCompanyDetail();
  const createStoreMutation = useCreateStore();
  const { addAlert } = useAlertStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    businessRegistrationForm: defaultBusinessRegistrationForm,
    onlineTradingCompanyDetailForm: defaultOnlineTradingCompanyDetailForm,
    storeForm: defaultStoreForm,
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
    if (response.available) {
      setStepData((prev) => ({
        ...prev,
        businessRegistrationForm: data,
      }));
      handleNextStep();
    } else {
      addAlert({
        severity: "error",
        message: BUSINESS_ERROR_MESSAGES.BUSINESS_VALIDATION_FAILED,
      });
    }
  };

  const handleSubmitStep2 = async (data: IOnlineTradingCompanyDetailForm) => {
    const response = await getOnlineTradingCompanyDetailMutation.mutateAsync({
      brno: stepData.businessRegistrationForm.b_no,
      prmmiMnno: data.prmmiMnno,
    });
    if (response.available) {
      setStepData((prev) => ({
        ...prev,
        onlineTradingCompanyDetailForm: data,
      }));
      handleNextStep();
    } else {
      addAlert({
        severity: "error",
        message: BUSINESS_ERROR_MESSAGES.ONLINE_TRADING_COMPANY_DETAIL_VALIDATION_FAILED,
      });
    }
  };

  const handleSubmitStep3 = async (data: IStoreForm) => {
    if (!stepData.businessRegistrationForm || !stepData.onlineTradingCompanyDetailForm) {
      return;
    }

    setStepData((prev) => ({
      ...prev,
      storeForm: data,
    }));

    await createStoreMutation.mutateAsync({
      businessValidation: stepData.businessRegistrationForm,
      onlineTradingCompanyDetail: {
        brno: stepData.businessRegistrationForm.b_no,
        prmmiMnno: stepData.onlineTradingCompanyDetailForm.prmmiMnno,
      },
      name: data.name,
      description: data.description,
      logoImageUrl: data.logoImageUrl,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessRegistrationForm
            onSubmit={handleSubmitStep1}
            initialValue={stepData.businessRegistrationForm}
            onChange={(data) =>
              setStepData((prev) => ({ ...prev, businessRegistrationForm: data }))
            }
          />
        );
      case 2:
        return (
          <OnlineTradingCompanyDetailForm
            onSubmit={handleSubmitStep2}
            onPrevious={handlePreviousStep}
            initialValue={stepData.onlineTradingCompanyDetailForm}
            onChange={(data) =>
              setStepData((prev) => ({ ...prev, onlineTradingCompanyDetailForm: data }))
            }
          />
        );
      case 3:
        return (
          <StoreCreationForm
            onSubmit={handleSubmitStep3}
            onPrevious={handlePreviousStep}
            initialValue={stepData.storeForm}
            onChange={(data) => setStepData((prev) => ({ ...prev, storeForm: data }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">스토어 만들기</h1>
      <ProgressBar activeStep={currentStep - 1} steps={STEPS} />

      <Card>
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>
    </div>
  );
};
