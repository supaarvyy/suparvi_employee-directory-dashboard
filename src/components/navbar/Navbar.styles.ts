import { SxProps } from "@mui/joy/styles/types";
import { THEME_COLORS } from "../../constants/config";

export const navbarStyles = {
  container: {
    px: { xs: 2, sm: 4, md: 6 },
    py: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME_COLORS.NAVBAR_BG,
    boxShadow: "md",
    width: "100%",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 1100,
  } as SxProps,
  leftTabGroup: {
    display: "flex",
    alignItems: "center",
    gap: 3,
  } as SxProps,
  brandTitle: {
    fontWeight: "xl",
    letterSpacing: "0.5px",
    fontSize: { xs: "0.9rem", sm: "1.15rem", md: "1.4rem" },
    color: "common.white",
  } as SxProps,
  rightUserGroup: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  } as SxProps,
};
