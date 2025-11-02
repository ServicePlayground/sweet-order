import React from "react";
import { Dashboard as DashboardIcon, Inventory2 as Inventory2Icon } from "@mui/icons-material";
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
        icon: React.createElement(DashboardIcon),
        path: ROUTES.ROOT,
      },
    ];
  }

  return [
    {
      text: "홈",
      icon: React.createElement(DashboardIcon),
      path: ROUTES.STORE_DETAIL_HOME(storeId),
    },
    {
      text: "상품",
      icon: React.createElement(Inventory2Icon),
      path: ROUTES.STORE_DETAIL_PRODUCTS(storeId),
      children: [
        { text: "상품 목록", path: ROUTES.STORE_DETAIL_PRODUCTS_LIST(storeId) },
        { text: "상품 등록", path: ROUTES.STORE_DETAIL_PRODUCTS_CREATE(storeId) },
      ],
    },
  ];
}
