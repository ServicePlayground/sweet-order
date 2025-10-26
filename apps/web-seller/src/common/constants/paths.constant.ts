import { Home } from "@/apps/web-seller/pages/Home";

export const ROUTES = {
  HOME: "/",
} as const;

export const ROUTE_CONFIG = [
  {
    path: ROUTES.HOME,
    element: Home,
  },
] as const;
