import { RootPage } from "@/apps/web-seller/pages/Root";
import { StoreCreatePage } from "@/apps/web-seller/pages/store/Create";
import { StoreDetailHomePage } from "@/apps/web-seller/pages/store/detail/Home";
import { StoreDetailProductListPage } from "@/apps/web-seller/pages/store/detail/products/List";
import { StoreDetailProductCreatePage } from "@/apps/web-seller/pages/store/detail/products/Create";
import { StoreDetailProductDetailPage } from "@/apps/web-seller/pages/store/detail/products/Detail";
import { StoreDetailChatListPage } from "@/apps/web-seller/pages/store/detail/chat/List";
import { StoreDetailChatRoomPage } from "@/apps/web-seller/pages/store/detail/chat/Room";
import { LoginPage } from "@/apps/web-seller/pages/auth/Login";
import { BasicLoginPage } from "@/apps/web-seller/pages/auth/BasicLogin";
import { GoogleAuthCallbackPage } from "@/apps/web-seller/pages/auth/GoogleAuthCallback";
import { BasicRegisterPage } from "@/apps/web-seller/pages/auth/BasicRegister";
import { FindAccountPage } from "@/apps/web-seller/pages/auth/FindAccount";
import { ResetPasswordPage } from "@/apps/web-seller/pages/auth/ResetPassword";

export const ROUTES = {
  ROOT: "/",
  // 스토어 관련 경로
  STORE_CREATE: "/store/create",
  STORE_DETAIL_HOME: (storeId: string) => `/stores/${storeId}`,
  STORE_DETAIL_PRODUCTS: (storeId: string) => `/stores/${storeId}/products`,
  STORE_DETAIL_PRODUCTS_LIST: (storeId: string) => `/stores/${storeId}/products/list`,
  STORE_DETAIL_PRODUCTS_CREATE: (storeId: string) => `/stores/${storeId}/products/create`,
  STORE_DETAIL_PRODUCTS_DETAIL: (storeId: string, productId: string) =>
    `/stores/${storeId}/products/${productId}`,
  STORE_DETAIL_CHAT_LIST: (storeId: string) => `/stores/${storeId}/chat`,
  STORE_DETAIL_CHAT_ROOM: (storeId: string, roomId: string) => `/stores/${storeId}/chat/${roomId}`,
  // 인증 관련 경로
  AUTH: {
    LOGIN: "/auth/login",
    LOGIN_BASIC: "/auth/login/basic",
    GOOGLE_REDIRECT_URI: "/auth/login/google",
    REGISTER_BASIC: "/auth/register/basic",
    FIND_ACCOUNT: "/auth/find-account",
    RESET_PASSWORD: "/auth/reset-password",
  },
} as const;

// 인증 관련 경로 (AdminLayout 밖)
export const AUTH_ROUTE_CONFIG = [
  { path: ROUTES.AUTH.LOGIN, element: LoginPage },
  { path: ROUTES.AUTH.LOGIN_BASIC, element: BasicLoginPage },
  { path: ROUTES.AUTH.GOOGLE_REDIRECT_URI, element: GoogleAuthCallbackPage },
  { path: ROUTES.AUTH.REGISTER_BASIC, element: BasicRegisterPage },
  { path: ROUTES.AUTH.FIND_ACCOUNT, element: FindAccountPage },
  { path: ROUTES.AUTH.RESET_PASSWORD, element: ResetPasswordPage },
] as const;

// 관리자 관련 경로 (AdminLayout 안)
export const ADMIN_ROUTE_CONFIG = [
  { path: ROUTES.ROOT, element: RootPage },
  // 스토어 관련 경로
  { path: ROUTES.STORE_CREATE, element: StoreCreatePage },
  { path: ROUTES.STORE_DETAIL_HOME(":storeId"), element: StoreDetailHomePage },
  { path: ROUTES.STORE_DETAIL_PRODUCTS(":storeId"), element: StoreDetailProductListPage },
  { path: ROUTES.STORE_DETAIL_PRODUCTS_LIST(":storeId"), element: StoreDetailProductListPage },
  { path: ROUTES.STORE_DETAIL_PRODUCTS_CREATE(":storeId"), element: StoreDetailProductCreatePage },
  {
    path: ROUTES.STORE_DETAIL_PRODUCTS_DETAIL(":storeId", ":productId"),
    element: StoreDetailProductDetailPage,
  },
  { path: ROUTES.STORE_DETAIL_CHAT_LIST(":storeId"), element: StoreDetailChatListPage },
  {
    path: ROUTES.STORE_DETAIL_CHAT_ROOM(":storeId", ":roomId"),
    element: StoreDetailChatRoomPage,
  },
] as const;
