import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Common/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
공통 토스트 팝업 컴포넌트

## Variant
- **row**: 아이콘과 텍스트가 한 줄로 나란히
- **column**: 아이콘이 위, 텍스트가 아래

## 사용 예시
\`\`\`tsx
const [show, setShow] = useState(false);

{show && (
  <Toast
    message="주소가 복사됐어요!"
    iconName="checkCircle"
    iconClassName="text-green-400"
    variant="row"
    onClose={() => setShow(false)}
  />
)}
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["row", "column"],
      control: { type: "radio" },
      description: "레이아웃 형태",
      table: { defaultValue: { summary: "row" } },
    },
    message: {
      control: { type: "text" },
      description: "표시할 메시지",
    },
    iconName: {
      control: { type: "text" },
      description: "아이콘 이름 (생략 시 아이콘 없음)",
    },
    iconClassName: {
      control: { type: "text" },
      description: "아이콘 색상 클래스 (기본: text-white)",
    },
    duration: {
      control: { type: "number" },
      description: "표시 시간 (ms)",
      table: { defaultValue: { summary: "2000" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

// ==================== 인터랙티브 래퍼 ====================

function ToastDemo(props: Omit<React.ComponentProps<typeof Toast>, "onClose">) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ width: 300, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button
        onClick={() => setShow(true)}
        style={{
          padding: "10px 20px",
          background: "#1F1F1E",
          color: "#fff",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        토스트 띄우기
      </button>
      {show && <Toast {...props} onClose={() => setShow(false)} />}
    </div>
  );
}

// ==================== Row ====================

export const Row: Story = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    message: "주소가 복사됐어요!",
    iconName: "checkCircle",
    iconClassName: "text-green-400",
    variant: "row",
    duration: 2000,
  },
};

export const RowNoIcon: Story = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    message: "저장됐어요!",
    variant: "row",
    duration: 2000,
  },
};

export const RowError: Story = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    message: "오류가 발생했어요.",
    iconName: "alertCircle",
    iconClassName: "text-red-400",
    variant: "row",
    duration: 2000,
  },
};

export const RowLongText: Story = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    message: "텍스트가 매우 길어지는 경우에도 잘 줄바꿈되는지 확인하는 토스트입니다.",
    iconName: "checkCircle",
    iconClassName: "text-green-400",
    variant: "row",
    duration: 3000,
  },
};

// ==================== Column ====================

export const Column: Story = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    message: "복사됐어요!",
    iconName: "checkCircle",
    iconClassName: "text-green-400",
    variant: "column",
    duration: 2000,
  },
};

export const ColumnNoIcon: Story = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    message: "저장됐어요!",
    variant: "column",
    duration: 2000,
  },
};

export const ColumnError: Story = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    message: "오류가 발생했어요.",
    iconName: "alertCircle",
    iconClassName: "text-red-400",
    variant: "column",
    duration: 2000,
  },
};
