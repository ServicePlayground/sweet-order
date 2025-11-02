import { RootPage } from "@/apps/web-seller/pages/Root";
import { StoreCreatePage } from "@/apps/web-seller/pages/store/Create";
import { StoreDetailHomePage } from "@/apps/web-seller/pages/store/detail/Home";
import { StoreDetailProductListPage } from "@/apps/web-seller/pages/store/detail/products/List";
import { StoreDetailProductCreatePage } from "@/apps/web-seller/pages/store/detail/products/Create";

export const ROUTES = {
  ROOT: "/",
  STORE_CREATE: "/store/create",
  STORE_DETAIL_HOME: (storeId: string) => `/stores/${storeId}`,
  STORE_DETAIL_PRODUCTS: (storeId: string) => `/stores/${storeId}/products`,
  STORE_DETAIL_PRODUCTS_LIST: (storeId: string) => `/stores/${storeId}/products/list`,
  STORE_DETAIL_PRODUCTS_CREATE: (storeId: string) => `/stores/${storeId}/products/create`,
} as const;

export const ROUTE_CONFIG = [
  { path: ROUTES.ROOT, element: RootPage },
  { path: ROUTES.STORE_CREATE, element: StoreCreatePage },
  // store-scoped routes
  { path: "/stores/:storeId", element: StoreDetailHomePage },
  { path: "/stores/:storeId/products", element: StoreDetailProductListPage },
  { path: "/stores/:storeId/products/list", element: StoreDetailProductListPage },
  { path: "/stores/:storeId/products/create", element: StoreDetailProductCreatePage },
] as const;
