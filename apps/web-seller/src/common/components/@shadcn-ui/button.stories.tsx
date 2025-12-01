import type { Meta, StoryObj } from "@storybook/react";
import { Button, buttonVariants } from "./button";
import { Save } from "lucide-react";

const variantOptions = ["default", "destructive", "outline", "link"] as const;
const sizeOptions = ["default", "sm", "lg"] as const;

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
  argTypes: {
    variant: {
      options: variantOptions,
      control: { type: "select" },
      description: "버튼의 스타일 변형 값",
    },
    size: {
      options: sizeOptions,
      control: { type: "select" },
      description: "버튼 크기",
    },
    asChild: {
      control: { type: "boolean" },
      description: "Slot 컴포넌트를 사용할지 여부",
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    size: "icon",
    asChild: false,
    children: "Save",
  },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Save className="h-4 w-4" />
        <span>Save</span>
      </>
    ),
  },
};

export const LinkButton: Story = {
  args: { variant: "link" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
