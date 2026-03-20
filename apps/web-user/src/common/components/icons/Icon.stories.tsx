import type { Meta, StoryObj } from "@storybook/react";
import Icon, { iconTypes } from "./Icon";

const allIconNames = Object.keys(iconTypes) as Array<keyof typeof iconTypes>;

const meta: Meta<typeof Icon> = {
  title: "Common/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
공통 아이콘 컴포넌트

## 사용 가능한 아이콘
${allIconNames.map((name) => `- \`${name}\``).join("\n")}

## 사용 예시
\`\`\`tsx
import { Icon } from "@/common/components/icons";

<Icon name="cart" width={24} height={24} />
<Icon name="favorite" width={20} height={20} className="text-red-500" />
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: allIconNames,
    },
    width: { control: "number" },
    height: { control: "number" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

// ==================== 단일 아이콘 ====================

export const Default: Story = {
  args: {
    name: "cart",
    width: 24,
    height: 24,
  },
};

// ==================== 모든 아이콘 ====================

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "16px" }}>
      {allIconNames.map((name) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            padding: "16px",
            border: "1px solid #e5e5e5",
            borderRadius: "8px",
          }}
        >
          <Icon name={name} width={24} height={24} />
          <span
            style={{ fontSize: "11px", color: "#666", textAlign: "center", wordBreak: "break-all" }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

// ==================== 크기 ====================

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      {[16, 20, 24, 32, 48].map((size) => (
        <div key={size} style={{ textAlign: "center" }}>
          <Icon name="cart" width={size} height={size} />
          <div style={{ fontSize: "10px", marginTop: "4px" }}>{size}px</div>
        </div>
      ))}
    </div>
  ),
};

// ==================== 색상 ====================

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      {[
        { label: "default", className: "" },
        { label: "primary", className: "text-orange-500" },
        { label: "gray", className: "text-gray-400" },
        { label: "red", className: "text-red-500" },
        { label: "blue", className: "text-blue-500" },
      ].map(({ label, className }) => (
        <div key={label} style={{ textAlign: "center" }}>
          <Icon name="favorite" width={24} height={24} className={className} />
          <div style={{ fontSize: "10px", marginTop: "4px" }}>{label}</div>
        </div>
      ))}
    </div>
  ),
};

// ==================== 아이콘 목록 ====================

export const IconList: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "bold" }}>
        사용 가능한 아이콘 ({allIconNames.length}개)
      </h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e5e5" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Icon</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
          </tr>
        </thead>
        <tbody>
          {allIconNames.map((name) => (
            <tr key={name} style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={{ padding: "8px" }}>
                <Icon name={name} width={24} height={24} />
              </td>
              <td style={{ padding: "8px", fontFamily: "monospace" }}>{name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
