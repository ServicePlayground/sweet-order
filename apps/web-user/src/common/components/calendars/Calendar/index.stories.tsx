import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from ".";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    selectedDate: {
      control: { type: "date" },
      description: "선택된 날짜",
    },
    onDateSelect: {
      action: "date-selected",
      description: "날짜 선택 핸들러",
    },
    minDate: {
      control: { type: "date" },
      description: "최소 선택 가능한 날짜",
    },
    maxDate: {
      control: { type: "date" },
      description: "최대 선택 가능한 날짜",
    },
    className: {
      control: { type: "text" },
      description: "커스텀 클래스명",
    },
    initialMonth: {
      control: { type: "date" },
      description: "초기 표시 월",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// 기본 사용 예제 (상태 관리 포함)
export const Default: Story = {
  render: (args) => {
    // 스토리북의 date 컨트롤은 타임스탬프(숫자)를 반환하므로 Date 객체로 변환
    const convertToDate = (date: Date | number | string | undefined): Date | undefined => {
      if (!date) return undefined;
      if (date instanceof Date) return date;
      if (typeof date === "number") return new Date(date);
      if (typeof date === "string") return new Date(date);
      return undefined;
    };

    const selectedDate = args.selectedDate ? convertToDate(args.selectedDate) || null : null;

    return (
      <Calendar
        {...args}
        selectedDate={selectedDate}
        minDate={convertToDate(args.minDate)}
        maxDate={convertToDate(args.maxDate)}
        initialMonth={convertToDate(args.initialMonth) || new Date()}
      />
    );
  },
};
