import React from "react";
import { Home, Package, MessageSquare, Store } from "lucide-react";
import { ROUTES } from "./paths.constant";

export interface MenuChildItem {
  text: string;
  path: string;
}

export interface MenuItem {
  text: string;
  icon?: React.ReactElement;
  path?: string; // for leaf or parent default
  children?: MenuChildItem[];
}

export function getMenuItems(storeId: string | null): MenuItem[] {
  if (!storeId) {
    // 스토어 선택 전에는 홈만 노출 (루트)
    return [
      {
        text: "홈",
        icon: React.createElement(Home, { className: "w-5 h-5" }),
        path: ROUTES.ROOT,
      },
    ];
  }

  return [
    {
      text: "홈",
      icon: React.createElement(Home, { className: "w-5 h-5" }),
      path: ROUTES.STORE_DETAIL_HOME(storeId),
    },
    {
      text: "스토어",
      icon: React.createElement(Store, { className: "w-5 h-5" }),
      children: [{ text: "스토어 수정", path: ROUTES.STORE_DETAIL_EDIT(storeId) }],
    },
    {
      text: "상품",
      icon: React.createElement(Package, { className: "w-5 h-5" }),
      children: [
        { text: "상품 목록", path: ROUTES.STORE_DETAIL_PRODUCTS_LIST(storeId) },
        { text: "상품 등록", path: ROUTES.STORE_DETAIL_PRODUCTS_CREATE(storeId) },
      ],
    },
    {
      text: "채팅",
      icon: React.createElement(MessageSquare, { className: "w-5 h-5" }),
      children: [{ text: "채팅 목록", path: ROUTES.STORE_DETAIL_CHAT_LIST(storeId) }],
    },
  ];
}
