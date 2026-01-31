"use client";

import { BottomSheet } from "@/apps/web-user/common/components/bottom-sheets/BottomSheet";
import { Modal } from "@/apps/web-user/common/components/modals/Modal";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { ReservationBottomSheetProps } from "./types";
import { useReservationBottomSheet } from "./useReservationBottomSheet";
import { ReservationOptionsView } from "./ReservationOptionsView";
import { ReservationCalendarView } from "./ReservationCalendarView";
import { ReservationConfirmView } from "./ReservationConfirmView";

export function ReservationBottomSheet({
  isOpen,
  price,
  cakeTitle,
  cakeImageUrl,
  cakeSizeOptions,
  cakeFlavorOptions,
  onClose,
  onConfirm,
}: ReservationBottomSheetProps) {
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
    imageUrls,
    fileInputRef,
    orderItems,
    isCancelModalOpen,
    setIsCancelModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    totalQuantity,
    totalPrice,
    isOptionsValid,
    isCalendarValid,
    isAddingFromConfirm,
    formatDateTime,
    handleOpenCalendar,
    handleCalendarConfirm,
    handleCancelClick,
    handleConfirmCancel,
    handleClose,
    handleGoToConfirm,
    handleFinalConfirm,
    handleQuantityChange,
    handleDeleteClick,
    handleConfirmDelete,
    handleEditItem,
    handleAddNewItem,
    handleUploadClick,
    handleFileChange,
    handleRemoveImage,
  } = useReservationBottomSheet({ isOpen, price, onClose, onConfirm });

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
            <span className="text-xl font-bold text-gray-900">{price.toLocaleString()}원</span>
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
          <Button onClick={handleFinalConfirm} disabled={orderItems.length === 0}>
            주문하기
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
      formatDateTime={formatDateTime}
      handleEditItem={handleEditItem}
      handleDeleteClick={handleDeleteClick}
      handleQuantityChange={handleQuantityChange}
      handleAddNewItem={handleAddNewItem}
    />
  );

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={handleClose} title={getTitle()} footer={renderFooter()}>
        {view === "options" && renderOptionsView()}
        {view === "calendar" && renderCalendarView()}
        {view === "confirm" && renderConfirmView()}
      </BottomSheet>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="작성을 취소하시겠습니까?"
        description="작성 중인 내용이 저장되지 않습니다."
        confirmText="계속 진행하기"
        cancelText="취소"
        onCancel={handleConfirmCancel}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="상품을 삭제하시겠습니까?"
        description="선택한 옵션이 모두 삭제됩니다."
        confirmText="계속 진행하기"
        cancelText="삭제"
        onCancel={handleConfirmDelete}
      />
    </>
  );
}
