import { HomePage } from "@/apps/web-seller/pages/Home";
import { StoreCreatePage } from "@/apps/web-seller/pages/store/Create";

export const ROUTES = {
  HOME: "/",
  STORE_CREATE: "/store/create",
} as const;

export const ROUTE_CONFIG = [
  {
    path: ROUTES.HOME,
    element: HomePage,
  },
  {
    path: ROUTES.STORE_CREATE,
    element: StoreCreatePage,
  },
] as const;
