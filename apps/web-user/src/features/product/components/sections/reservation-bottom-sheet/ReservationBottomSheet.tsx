"use client";

import { BottomSheet } from "@/apps/web-user/common/components/bottom-sheets/BottomSheet";
import { Modal } from "@/apps/web-user/common/components/modals/Modal";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { ReservationBottomSheetProps } from "./types";
import { useReservationBottomSheet } from "./useReservationBottomSheet";
import { ReservationOptionsView } from "./ReservationOptionsView";
import { ReservationCalendarView } from "./ReservationCalendarView";
import { ReservationConfirmView } from "./ReservationConfirmView";
import { useCreateOrder } from "@/apps/web-user/features/order/hooks/mutations/useCreateOrder";
import { CreateOrderRequest } from "@/apps/web-user/features/order/types/order.type";
import { useUploadFile } from "@/apps/web-user/features/upload/hooks/mutations/useUploadFile";

export function ReservationBottomSheet({
  isOpen,
  productId,
  price,
  cakeTitle,
  cakeImageUrl,
  cakeImages = [],
  cakeSizeOptions,
  cakeFlavorOptions,
  productType,
  storeName,
  pickupAddress,
  pickupRoadAddress,
  pickupDetailAddress,
  pickupZonecode,
  pickupLatitude,
  pickupLongitude,
  imageUploadEnabled,
  letteringMaxLength,
  onClose,
}: ReservationBottomSheetProps) {
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutateAsync: uploadFile } = useUploadFile();
  const {
    view,
    setView,
    selectedDate,
    tempSelectedDate,
    setTempSelectedDate,
    tempSelectedTime,
    setTempSelectedTime,
    selectedSize,
    setSelectedSize,
    selectedFlavor,
    setSelectedFlavor,
    letteringMessage,
    setLetteringMessage,
    requestMessage,
    setRequestMessage,
    reserverName,
    setReserverName,
    reserverPhone,
    setReserverPhone,
    agreePayment,
    setAgreePayment,
    agreeRefund,
    setAgreeRefund,
    agreeOptionChange,
    setAgreeOptionChange,
    allAgreed,
    handleToggleAllAgreements,
    isAgreementAlertOpen,
    setIsAgreementAlertOpen,
    imageUrls,
    fileInputRef,
    orderItems,
    isCancelModalOpen,
    setIsCancelModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    totalQuantity,
    totalPrice,
    currentOptionPrice,
    isOptionsValid,
    isCalendarValid,
    isAddingFromConfirm,
    isEditingFromConfirm,
    dateSelectionSignal,
    formatDateTime,
    isDateChangeModalOpen,
    setIsDateChangeModalOpen,
    handleOpenCalendar,
    handleCalendarConfirm,
    handleDateChangeConfirm,
    handleDateChangeCancel,
    handleCancelClick,
    handleConfirmCancel,
    handleClose,
    handleGoToConfirm,
    handleQuantityChange,
    handleDeleteClick,
    handleConfirmDelete,
    handleEditItem,
    handleAddNewItem,
    handleUploadClick,
    handleFileChange,
    handleRemoveImage,
  } = useReservationBottomSheet({
    isOpen,
    price,
    productType,
    cakeSizeOptions,
    cakeFlavorOptions,
    onClose,
  });

  const getTitle = () => {
    if (view === "options") return "상품 옵션 선택";
    if (view === "calendar") return "날짜 선택";
    return "주문확인";
  };

  const renderFooter = () => {
    if (view === "options") {
      const confirmButtonText = isAddingFromConfirm ? "추가완료" : "선택완료";
      return (
        <div className="px-[20px]">
          <div className="flex items-center justify-between pt-[14px]">
            <span className="text-sm text-gray-700">총 금액</span>
            <span className="text-xl font-bold text-gray-900">
              {currentOptionPrice.toLocaleString()}원
            </span>
          </div>
          <div className="py-[12px] flex gap-[8px]">
            <span className="w-[100px]">
              <Button variant="outline" onClick={handleCancelClick}>
                취소
              </Button>
            </span>
            <span className="flex-1">
              <Button onClick={handleGoToConfirm} disabled={!isOptionsValid}>
                {confirmButtonText}
              </Button>
            </span>
          </div>
        </div>
      );
    }

    if (view === "calendar") {
      return (
        <div className="px-[20px] py-[12px] flex gap-[8px]">
          <span className="w-[100px]">
            <Button variant="outline" onClick={() => setView("options")}>
              닫기
            </Button>
          </span>
          <span className="flex-1">
            <Button onClick={handleCalendarConfirm} disabled={!isCalendarValid}>
              선택완료
            </Button>
          </span>
        </div>
      );
    }

    return (
      <div className="px-[20px]">
        <div className="flex items-center justify-between pt-[14px]">
          <span className="text-sm text-gray-700">총 금액 ({totalQuantity}개)</span>
          <span className="text-xl font-bold text-gray-900">{totalPrice.toLocaleString()}원</span>
        </div>
        <div className="py-[12px]">
          <Button
            onClick={async () => {
              if (!allAgreed) {
                setIsAgreementAlertOpen(true);
                return;
              }
              // 각 OrderItem의 이미지를 업로드하고 URL 받기
              const itemsWithImageUrls = await Promise.all(
                orderItems.map(async (item) => {
                  // 각 항목의 이미지 File을 업로드하고 URL 받기
                  let uploadedImageUrls: string[] = [];
                  if (item.imageFiles && item.imageFiles.length > 0) {
                    // 모든 이미지 File을 병렬로 업로드
                    uploadedImageUrls = await Promise.all(
                      item.imageFiles.map(async (file) => {
                        const response = await uploadFile(file);
                        return response.fileUrl;
                      }),
                    );
                  }

                  // 사이즈 옵션 정보 찾기
                  const sizeOption = cakeSizeOptions?.find((opt) => opt.displayName === item.size);
                  // 맛 옵션 정보 찾기
                  const flavorOption = cakeFlavorOptions?.find(
                    (opt) => opt.displayName === item.flavor,
                  );

                  return {
                    // 사이즈 옵션 정보 (있는 경우만)
                    ...(sizeOption && {
                      sizeId: sizeOption.id,
                      sizeDisplayName: sizeOption.displayName,
                      sizeLengthCm: sizeOption.lengthCm,
                      sizeDescription: sizeOption.description,
                      sizePrice: sizeOption.price,
                    }),
                    // 맛 옵션 정보 (있는 경우만)
                    ...(flavorOption && {
                      flavorId: flavorOption.id,
                      flavorDisplayName: flavorOption.displayName,
                      flavorPrice: flavorOption.price,
                    }),
                    // 기타 옵션
                    ...(item.letteringMessage && {
                      letteringMessage: item.letteringMessage,
                    }),
                    ...(item.requestMessage && {
                      requestMessage: item.requestMessage,
                    }),
                    quantity: item.quantity,
                    imageUrls: uploadedImageUrls,
                  };
                }),
              );

              // API 요청 데이터 구성 (주문 시점의 정보 전달)
              const orderRequest: CreateOrderRequest = {
                pickupDate: selectedDate ? selectedDate.toISOString() : "",
                productId,
                productName: cakeTitle,
                productImages:
                  cakeImages.length > 0 ? cakeImages : cakeImageUrl ? [cakeImageUrl] : [],
                totalQuantity,
                totalPrice,
                storeName,
                // 픽업 정보
                pickupAddress,
                pickupRoadAddress,
                pickupDetailAddress,
                pickupZonecode,
                pickupLatitude,
                pickupLongitude,
                items: itemsWithImageUrls,
              };

              // API 호출
              createOrder(orderRequest);
            }}
            disabled={orderItems.length === 0 || isCreatingOrder}
          >
            {isCreatingOrder
              ? "처리 중..."
              : productType === "BASIC_CAKE"
                ? "예약하기"
                : "예약신청"}
          </Button>
        </div>
      </div>
    );
  };

  const renderOptionsView = () => (
    <ReservationOptionsView
      selectedDate={selectedDate}
      selectedSize={selectedSize}
      setSelectedSize={setSelectedSize}
      selectedFlavor={selectedFlavor}
      setSelectedFlavor={setSelectedFlavor}
      letteringMessage={letteringMessage}
      setLetteringMessage={setLetteringMessage}
      requestMessage={requestMessage}
      setRequestMessage={setRequestMessage}
      cakeSizeOptions={cakeSizeOptions}
      cakeFlavorOptions={cakeFlavorOptions}
      imageUrls={imageUrls}
      fileInputRef={fileInputRef}
      handleOpenCalendar={handleOpenCalendar}
      handleUploadClick={handleUploadClick}
      handleFileChange={handleFileChange}
      handleRemoveImage={handleRemoveImage}
      dateSelectionSignal={dateSelectionSignal}
      productType={productType}
      isAddingFromConfirm={isAddingFromConfirm && orderItems.length > 0}
      isEditingFromConfirm={isEditingFromConfirm && orderItems.length > 1}
      imageUploadEnabled={imageUploadEnabled}
      letteringMaxLength={letteringMaxLength}
    />
  );

  const renderCalendarView = () => (
    <ReservationCalendarView
      tempSelectedDate={tempSelectedDate}
      setTempSelectedDate={setTempSelectedDate}
      tempSelectedTime={tempSelectedTime}
      setTempSelectedTime={setTempSelectedTime}
    />
  );

  const renderConfirmView = () => (
    <ReservationConfirmView
      orderItems={orderItems}
      cakeTitle={cakeTitle}
      cakeImageUrl={cakeImageUrl}
      price={price}
      selectedDate={selectedDate}
      formatDateTime={formatDateTime}
      handleEditItem={handleEditItem}
      handleDeleteClick={handleDeleteClick}
      handleQuantityChange={handleQuantityChange}
      handleAddNewItem={handleAddNewItem}
      reserverName={reserverName}
      setReserverName={setReserverName}
      reserverPhone={reserverPhone}
      setReserverPhone={setReserverPhone}
      agreePayment={agreePayment}
      setAgreePayment={setAgreePayment}
      agreeRefund={agreeRefund}
      setAgreeRefund={setAgreeRefund}
      agreeOptionChange={agreeOptionChange}
      setAgreeOptionChange={setAgreeOptionChange}
      allAgreed={allAgreed}
      handleToggleAllAgreements={handleToggleAllAgreements}
    />
  );

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={getTitle()}
        footer={renderFooter()}
        fullScreen={view === "confirm"}
        scrollResetKey={view}
      >
        {view === "options" && renderOptionsView()}
        {view === "calendar" && renderCalendarView()}
        {view === "confirm" && renderConfirmView()}
      </BottomSheet>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="예약 진행 취소"
        description="예약 진행을 취소하시겠습니까?"
        confirmText="계속 진행하기"
        cancelText="취소"
        onCancel={handleConfirmCancel}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="상품 삭제"
        description="해당 상품을 삭제하시겠습니까?"
        confirmText="취소"
        cancelText="삭제"
        onCancel={handleConfirmDelete}
      />

      <Modal
        isOpen={isDateChangeModalOpen}
        onClose={() => setIsDateChangeModalOpen(false)}
        title="픽업 날짜 변경"
        description="픽업 날짜 변경 시 주문하는 다른 상품들의 픽업 날짜도 함께 변경됩니다."
        confirmText="변경취소"
        cancelText="확인"
        confirmVariant="outline"
        cancelVariant="primary"
        onConfirm={handleDateChangeCancel}
        onCancel={handleDateChangeConfirm}
      />

      <Modal
        isOpen={isAgreementAlertOpen}
        onClose={() => setIsAgreementAlertOpen(false)}
        title="필수 동의 항목 미동의"
        description="필수 동의 항목에 모두 동의하셔야 예약이 진행됩니다."
        confirmText="확인"
        confirmVariant="primary"
        onConfirm={() => setIsAgreementAlertOpen(false)}
        hideCancel
      />
    </>
  );
}
