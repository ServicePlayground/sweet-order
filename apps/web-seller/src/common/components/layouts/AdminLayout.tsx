import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { Menu, User, LogOut, Bell } from "lucide-react";
import { AdminSidebar } from "@/apps/web-seller/common/components/sidebar/AdminSidebar";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import { useLogout } from "@/apps/web-seller/features/auth/hooks/mutations/useAuthMutation";
import {
  SellerNotificationScope,
  useSellerNotifications,
} from "@/apps/web-seller/features/notification/components/providers/SellerNotificationProvider";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

function AdminHeaderNotificationButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const notif = useSellerNotifications();

  const storeId = useMemo(() => {
    const m = location.pathname.match(/^\/stores\/([^/]+)/);
    return m ? m[1] : null;
  }, [location.pathname]);

  if (!storeId || !notif) {
    return null;
  }

  const unread = notif.unreadCount;

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={() => navigate(ROUTES.STORE_DETAIL_NOTIFICATIONS_LIST(storeId))}
      className="relative mr-1 shrink-0 text-zinc-700 hover:bg-zinc-100"
      aria-label={unread > 0 ? `알림 ${unread}건 읽지 않음` : "알림"}
    >
      <Bell className="h-6 w-6" />
      {unread > 0 ? (
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white",
          )}
        >
          {unread > 99 ? "99+" : unread}
        </span>
      ) : null}
    </Button>
  );
}

const drawerWidth = 300;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsDrawerOpen(!isDrawerOpen);
    }
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    logoutMutation.mutate();
  };

  return (
    <SellerNotificationScope>
    <div className="flex min-h-screen">
      {/* 헤더 */}
      <header
        className={`fixed top-0 right-0 z-10 bg-white border-b border-zinc-200 text-zinc-900 transition-all duration-300 ${
          isDrawerOpen && !isMobile ? `left-[${drawerWidth}px]` : "left-0"
        }`}
        style={{
          width: isDrawerOpen && !isMobile ? `calc(100% - ${drawerWidth}px)` : "100%",
          marginLeft: isDrawerOpen && !isMobile ? `${drawerWidth}px` : 0,
        }}
      >
        <div className="flex items-center h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDrawerToggle}
            className="mr-2 text-zinc-700 hover:bg-zinc-100"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="flex-1 text-xl font-semibold text-zinc-900">판매자 관리 시스템</h1>
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.STORE_CREATE)}
            className="mr-2 text-zinc-700 hover:bg-zinc-100"
          >
            스토어 만들기
          </Button>
          {isAuthenticated && (
            <div className="relative flex items-center">
              <AdminHeaderNotificationButton />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="text-zinc-700 hover:bg-zinc-100"
              >
                <User className="h-6 w-6" />
              </Button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-zinc-200 z-50">
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100 flex items-center gap-2 rounded-md disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 사이드바 */}
      <AdminSidebar
        isMobile={isMobile}
        open={isMobile ? mobileOpen : isDrawerOpen}
        onToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      {/* 메인 콘텐츠 */}
      <main
        className="flex-1 p-6 pt-20 transition-all duration-300"
        style={{
          marginLeft: isDrawerOpen && !isMobile ? `${drawerWidth}px` : 0,
          width: isDrawerOpen && !isMobile ? `calc(100% - ${drawerWidth}px)` : "100%",
        }}
      >
        {children}
      </main>
    </div>
    </SellerNotificationScope>
  );
};
