import React, { useState, useEffect } from "react";
import {
  Sheet,
  Typography,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dropdown,
  MenuButton,
  Tooltip,
  useColorScheme,
} from "@mui/joy";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { navbarStyles } from "./Navbar.styles";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({ onTabChange }) => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme state is synchronized after client mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <Sheet variant="solid" sx={navbarStyles.container}>
      <Box sx={navbarStyles.leftTabGroup}>
        <Typography
          level="title-sm"
          textColor="common.white"
          onClick={() => onTabChange("dashboard")}
          sx={{ cursor: "pointer", fontWeight: "bold" }}
        >
          Dashboard
        </Typography>
      </Box>

      <Typography level="h3" sx={navbarStyles.brandTitle}>
        Employee Directory Dashboard
      </Typography>

      <Box sx={navbarStyles.rightUserGroup}>
        {mounted && (
          <Tooltip
            title={
              mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            <IconButton
              variant="plain"
              onClick={toggleTheme}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        )}
        <IconButton variant="plain" sx={{ color: "white" }}>
          <NotificationsIcon />
        </IconButton>
        <Dropdown>
          <MenuButton
            slots={{ root: Box }}
            slotProps={{ root: { sx: { display: "flex", cursor: "pointer" } } }}
          >
            <Avatar size="sm" />
          </MenuButton>
          <Menu placement="bottom-end" sx={{ minWidth: 160 }}>
            <MenuItem>
              <PersonIcon fontSize="small" /> Profile
            </MenuItem>
            <MenuItem>
              <SettingsIcon fontSize="small" /> Settings
            </MenuItem>
            <MenuItem color="danger">
              <LogoutIcon fontSize="small" /> Logout
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Sheet>
  );
});
