import React from "react";
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  IconButton,
  FormControl,
  Select,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem as SelectItem,
} from "@mui/material";
import { ChevronLeft as ChevronLeftIcon } from "@mui/icons-material";
import { getMenuItems } from "@/apps/web-seller/common/constants/menu.constant";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { useLocation, useNavigate } from "react-router-dom";
import { useStoreStore } from "@/apps/web-seller/features/store/store/store.store.ts";

interface AdminSidebarProps {
  isMobile: boolean;
  open: boolean;
  onToggle: () => void;
  drawerWidth: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobile,
  open,
  onToggle,
  drawerWidth,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const { stores } = useStoreStore();

  const storeIdFromPath = React.useMemo(() => {
    const match = currentPath.match(/^\/stores\/([^/]+)/);
    return match ? match[1] : null;
  }, [currentPath]);
  const isStoreScopedPath = React.useMemo(() => currentPath.startsWith("/stores/"), [currentPath]);
  const isValidStoreId = React.useMemo(
    () => (storeIdFromPath ? stores.some((s) => s.id === storeIdFromPath) : false),
    [storeIdFromPath, stores],
  );
  const menuItems = React.useMemo(() => {
    // 1) 스토어 범위 경로 + 유효한 storeId일 때만 스토어 메뉴 노출
    if (isStoreScopedPath && isValidStoreId) {
      return getMenuItems(storeIdFromPath);
    }
    // 2) 스토어가 없고 ROOT 경로일 때는 홈 메뉴만 노출
    if (!isStoreScopedPath && stores.length === 0 && currentPath === ROUTES.ROOT) {
      return getMenuItems(null);
    }
    // 3) 그 외(유효하지 않은 storeId, 비스토어 경로 등)에는 아무 메뉴도 노출하지 않음
    return [];
  }, [isStoreScopedPath, isValidStoreId, storeIdFromPath, stores.length, currentPath]);

  const onNavigate = (path: string) => {
    navigate(path);
    if (isMobile) onToggle();
  };

  const onSelectStore = (id: string) => {
    onNavigate(ROUTES.STORE_DETAIL_HOME(id));
  };

  return (
    <Box component="nav" sx={{ width: { md: open ? drawerWidth : 0 }, flexShrink: { md: 0 } }}>
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        <Box>
          <Toolbar>
            {stores.length > 0 ? (
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={storeIdFromPath || ""}
                  onChange={(e) => onSelectStore(e.target.value as string)}
                  displayEmpty
                  renderValue={(value) => {
                    const store = stores.find((s) => s.id === value);
                    return store ? store.name : "스토어 선택";
                  }}
                >
                  {stores.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body2" noWrap component="div">
                SWEET ORDER
              </Typography>
            )}
            {!isMobile && (
              <IconButton onClick={onToggle} sx={{ ml: "auto" }}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Toolbar>

          <List>
            {menuItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isParentSelected =
                currentPath === (item.path ?? "") ||
                (hasChildren && item.children!.some((c) => c.path === currentPath));

              return (
                <React.Fragment key={item.text}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={isParentSelected}
                      onClick={() => {
                        if (item.path) {
                          onNavigate(item.path);
                        }
                      }}
                    >
                      {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>

                  {hasChildren && (
                    <List sx={{ pl: 4 }}>
                      {item.children!.map((child) => (
                        <ListItem key={child.text} disablePadding>
                          <ListItemButton
                            selected={currentPath === child.path}
                            onClick={() => onNavigate(child.path)}
                          >
                            <ListItemText primary={child.text} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};
