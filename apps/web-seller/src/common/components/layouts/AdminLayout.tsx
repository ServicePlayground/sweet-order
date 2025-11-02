import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle, Logout as LogoutIcon } from "@mui/icons-material";
import { AdminSidebar } from "@/apps/web-seller/common/components/sidebar/AdminSidebar";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import { useLogout } from "@/apps/web-seller/features/auth/hooks/queries/useAuth";

const drawerWidth = 300;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsDrawerOpen(!isDrawerOpen);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    logoutMutation.mutate();
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* 헤더 */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          ml: { md: isDrawerOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            판매자 관리 시스템
          </Typography>
          <Button color="inherit" onClick={() => navigate(ROUTES.STORE_CREATE)} sx={{ mr: 1 }}>
            스토어 만들기
          </Button>
          {isAuthenticated && user && (
            <Button
              color="inherit"
              onClick={handleProfileMenuOpen}
              startIcon={<AccountCircle />}
            ></Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 사이드바 */}
      <AdminSidebar
        isMobile={isMobile}
        open={isMobile ? mobileOpen : isDrawerOpen}
        onToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      {/* 메인 콘텐츠 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* 프로필 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>로그아웃</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};
