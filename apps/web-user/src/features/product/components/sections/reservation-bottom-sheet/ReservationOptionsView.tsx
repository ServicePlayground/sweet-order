"use client";

import { RefObject } from "react";
import { DatePickerInput } from "@/apps/web-user/common/components/datepickers/DatePicker";
import { Icon } from "@/apps/web-user/common/components/icons";
import { Select } from "@/apps/web-user/common/components/selectboxs/Select";
import { TextArea } from "@/apps/web-user/common/components/textareas/TextArea";
import {
  CakeFlavorOption,
  CakeSizeOption,
} from "@/apps/web-user/features/product/types/product.type";

interface ReservationOptionsViewProps {
  selectedDate: Date | null;
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  selectedFlavor: string;
  setSelectedFlavor: (value: string) => void;
  letteringMessage: string;
  setLetteringMessage: (value: string) => void;
  requestMessage: string;
  setRequestMessage: (value: string) => void;
  cakeSizeOptions?: CakeSizeOption[];
  cakeFlavorOptions?: CakeFlavorOption[];
  imageUrls: string[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleOpenCalendar: () => void;
  handleUploadClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
}

export function ReservationOptionsView({
  selectedDate,
  selectedSize,
  setSelectedSize,
  selectedFlavor,
  setSelectedFlavor,
  letteringMessage,
  setLetteringMessage,
  requestMessage,
  setRequestMessage,
  cakeSizeOptions,
  cakeFlavorOptions,
  imageUrls,
  fileInputRef,
  handleOpenCalendar,
  handleUploadClick,
  handleFileChange,
  handleRemoveImage,
}: ReservationOptionsViewProps) {
  return (
    <div className="px-[20px] py-[24px] flex flex-col gap-[24px]">
      <DatePickerInput
        value={selectedDate}
        label="픽업날짜 선택"
        placeholder="픽업할 날짜와 시간을 선택해주세요"
        onOpen={handleOpenCalendar}
      />
      <Select
        label="사이즈 선택"
        value={selectedSize}
        onChange={setSelectedSize}
        options={[
          { value: "", label: "사이즈를 선택해주세요" },
          ...(cakeSizeOptions?.map((size) => ({
            value: size.displayName,
            label: `${size.displayName} ${size.description}`,
          })) ?? []),
        ]}
      />
      <Select
        label="맛 선택"
        value={selectedFlavor}
        onChange={setSelectedFlavor}
        options={[
          { value: "", label: "시트를 선택해주세요" },
          ...(cakeFlavorOptions?.map((flavor) => ({
            value: flavor.displayName,
            label: flavor.displayName,
          })) ?? []),
        ]}
      />
      <TextArea
        label="레터링 문구"
        value={letteringMessage}
        onChange={setLetteringMessage}
        placeholder="가능한 10자 이내로 적어주세요."
        maxLength={200}
        showCount
      />
      <div className="flex flex-col gap-[6px]">
        <div className="block mb-[10px] text-sm font-bold text-gray-900">
          참고사진 <span className="font-normal text-gray-300">(선택)</span>
        </div>
        <div className="flex gap-[6px] overflow-auto w-full">
          <button
            type="button"
            onClick={handleUploadClick}
            className={`flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-lg h-[100px] ${
              imageUrls.length === 0 ? "w-full" : "w-[100px] shrink-0"
            }`}
          >
            <Icon name="addPhoto" width={24} height={24} className="mb-[4px] text-gray-300" />
            <div className="text-sm text-gray-300">
              {imageUrls.length === 0 ? "참고할 사진을 업로드해주세요" : "사진 업로드"}
              <br />({imageUrls.length}/5)
            </div>
          </button>
          {imageUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative h-[100px] w-[100px] rounded-lg shrink-0 border border-gray-100"
            >
              <button
                type="button"
                aria-label="첨부 이미지 삭제"
                onClick={() => handleRemoveImage(index)}
                className="absolute right-[5px] top-[5px]"
              >
                <Icon name="removePhoto" width={20} height={20} />
              </button>
              <img
                src={url}
                alt="업로드된 이미지 미리보기"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          ))}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      <TextArea
        label={
          <>
            요청사항 <span className="font-normal text-gray-300">(선택)</span>
          </>
        }
        value={requestMessage}
        onChange={setRequestMessage}
        placeholder="요청사항을 입력해주세요."
        maxLength={200}
        showCount
      />
    </div>
  );
}

