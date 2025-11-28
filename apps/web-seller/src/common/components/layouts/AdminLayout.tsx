import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/apps/web-seller/common/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { AdminSidebar } from "@/apps/web-seller/common/components/sidebar/AdminSidebar";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import { useLogout } from "@/apps/web-seller/features/auth/hooks/queries/useAuth";

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

  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    <div className="flex min-h-screen">
      {/* 헤더 */}
      <header
        className={`fixed top-0 right-0 z-10 bg-primary text-primary-foreground transition-all duration-300 ${
          isDrawerOpen && !isMobile ? `left-[${drawerWidth}px]` : 'left-0'
        }`}
        style={{
          width: isDrawerOpen && !isMobile ? `calc(100% - ${drawerWidth}px)` : '100%',
          marginLeft: isDrawerOpen && !isMobile ? `${drawerWidth}px` : 0
        }}
      >
        <div className="flex items-center h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDrawerToggle}
            className="mr-2 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="flex-1 text-xl font-semibold">판매자 관리 시스템</h1>
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.STORE_CREATE)}
            className="mr-2 text-primary-foreground hover:bg-primary-foreground/10"
          >
            스토어 만들기
          </Button>
          {isAuthenticated && user && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <User className="h-6 w-6" />
              </Button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg border z-50">
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 rounded-md"
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
          width: isDrawerOpen && !isMobile ? `calc(100% - ${drawerWidth}px)` : '100%'
        }}
      >
        {children}
      </main>
    </div>
  );
};
