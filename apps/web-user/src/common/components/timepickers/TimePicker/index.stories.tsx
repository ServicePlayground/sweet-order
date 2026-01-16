import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TimePicker } from ".";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    selectedTime: {
      control: { type: "date" },
      description: "선택된 시간",
    },
    onTimeSelect: {
      action: "time-selected",
      description: "시간 선택 핸들러",
    },
    className: {
      control: { type: "text" },
      description: "커스텀 클래스명",
    },
    interval: {
      control: { type: "number", min: 1, max: 60, step: 1 },
      description: "시간 간격 (분 단위, 기본값: 30분)",
    },
    disabledTimes: {
      control: { type: "object" },
      description:
        `비활성화할 시간 목록 (Date 배열). Controls에서 사용 시: 타임스탬프 배열 또는 ISO 문자열 배열 형식으로 입력. 예: [1739635200000, 1739637000000] 또는 ["2026-02-16T00:00:00", "2026-02-16T00:30:00"]`,
    },
    timeFormat: {
      control: { type: "select" },
      options: ["12h", "24h"],
      description: "시간 표기 형식 ('12h': 오전/오후, '24h': 24시간제)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

// 기본 사용 예제 (12시간제)
export const Default: Story = {
  render: (args) => {
    const convertToDate = (date: Date | number | string | undefined | null): Date | undefined => {
      if (!date) return undefined;
      if (date instanceof Date) return date;
      if (typeof date === "number") return new Date(date);
      if (typeof date === "string") return new Date(date);
      return undefined;
    };

    // disabledTimes가 배열인지 확인
    const getDisabledTimes = (): Date[] => {
      if (!args.disabledTimes) return [];
      if (!Array.isArray(args.disabledTimes)) return [];
      return args.disabledTimes
        .map(convertToDate)
        .filter((date): date is Date => date !== undefined);
    };

    return (
      <div style={{ width: "600px", padding: "20px" }}>
        <TimePicker
          {...args}
          selectedTime={convertToDate(args.selectedTime) || null}
          disabledTimes={getDisabledTimes()}
        />
      </div>
    );
  },
};
