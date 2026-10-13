import { SxProps } from "@mui/joy/styles/types";

export const employeeDetailsModalStyles = {
  modalDialog: {
    width: "500px",
    maxWidth: "90vw",
    borderRadius: "md",
    boxShadow: "lg",
    p: 3,
  } as SxProps,
  loadingBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 6,
  } as SxProps,
  headerBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  } as SxProps,
  headerTitle: {
    fontWeight: "bold",
  } as SxProps,
  statusBox: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    mb: 3,
  } as SxProps,
  statusSelect: {
    width: "140px",
  } as SxProps,
  tabsContainer: {
    backgroundColor: "transparent",
    mb: 3,
  } as SxProps,
  tabContent: {
    p: 2,
    backgroundColor: "background.level1",
    borderRadius: "sm",
    mt: 1,
  } as SxProps,
  footerBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    pt: 1,
  } as SxProps,
};
