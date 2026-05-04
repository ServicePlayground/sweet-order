import React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import "../src/common/styles/globals.css";

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: { width: "375px", height: "667px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "640px", height: "960px" },
        },
      },
    },
    backgrounds: {
      default: "white",
      values: [
        { name: "white", value: "#ffffff" },
        { name: "dark", value: "#1a1a1a" },
        { name: "slate", value: "#f7f8fa" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="font-sans" style={{ minHeight: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
