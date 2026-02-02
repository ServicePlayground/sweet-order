import type { Meta, StoryObj } from "@storybook/react";

const iconNames = [
  "cart",
  "chevronLeft",
  "arrow",
  "favorite",
  "favoriteFilled",
  "close",
  "calendar",
  "selectArrow",
  "addPhoto",
  "removePhoto",
  "takeout",
  "trash",
  "minus",
  "plus",
  "warning",
] as const;

const iconFiles: Record<string, string> = {
  cart: "cart.svg",
  chevronLeft: "chevron-left.svg",
  arrow: "arrow.svg",
  favorite: "favorite.svg",
  favoriteFilled: "favorite-filled.svg",
  close: "close.svg",
  calendar: "calendar.svg",
  selectArrow: "select-arrow.svg",
  addPhoto: "add-photo.svg",
  removePhoto: "remove-photo.svg",
  takeout: "takeout.svg",
  trash: "trash.svg",
  minus: "minus.svg",
  plus: "plus.svg",
  warning: "warning.svg",
};

// 스토리북용 간단한 Icon 표시 컴포넌트
const IconDisplay = ({
  name,
  size = 24,
}: {
  name: string;
  size?: number;
}) => (
  <img
    src={`/icons/${iconFiles[name]}`}
    alt={name}
    width={size}
    height={size}
  />
);

const meta: Meta = {
  title: "Common/Icon",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
공통 아이콘 컴포넌트

## 사용 가능한 아이콘
${iconNames.map((name) => `- \`${name}\``).join("\n")}

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
};

export default meta;
type Story = StoryObj;

// ==================== 모든 아이콘 ====================

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px" }}>
      {iconNames.map((name) => (
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
          <IconDisplay name={name} size={24} />
          <span style={{ fontSize: "12px", color: "#666" }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};

// ==================== 크기 ====================

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ textAlign: "center" }}>
        <IconDisplay name="cart" size={16} />
        <div style={{ fontSize: "10px", marginTop: "4px" }}>16px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <IconDisplay name="cart" size={20} />
        <div style={{ fontSize: "10px", marginTop: "4px" }}>20px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <IconDisplay name="cart" size={24} />
        <div style={{ fontSize: "10px", marginTop: "4px" }}>24px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <IconDisplay name="cart" size={32} />
        <div style={{ fontSize: "10px", marginTop: "4px" }}>32px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <IconDisplay name="cart" size={48} />
        <div style={{ fontSize: "10px", marginTop: "4px" }}>48px</div>
      </div>
    </div>
  ),
};

// ==================== 아이콘 목록 ====================

export const IconList: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "bold" }}>
        사용 가능한 아이콘 ({iconNames.length}개)
      </h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e5e5" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Icon</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "8px", textAlign: "left" }}>File</th>
          </tr>
        </thead>
        <tbody>
          {iconNames.map((name) => (
            <tr key={name} style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={{ padding: "8px" }}>
                <IconDisplay name={name} size={24} />
              </td>
              <td style={{ padding: "8px", fontFamily: "monospace" }}>{name}</td>
              <td style={{ padding: "8px", fontFamily: "monospace", color: "#666" }}>
                {iconFiles[name]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
