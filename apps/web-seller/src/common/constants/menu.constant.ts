import React from "react";
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { ROUTES } from "./paths.constant";

export interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    text: "홈",
    icon: React.createElement(DashboardIcon),
    path: ROUTES.HOME,
  },
];
