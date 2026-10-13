import { SxProps } from "@mui/joy/styles/types";

export const employeeTableStyles = {
  container: {
    maxWidth: "1200px",
    mx: "auto",
    width: "100%",
  } as SxProps,
  searchBox: {
    display: "flex",
    justifyContent: "center",
    mb: 4,
  } as SxProps,
  searchInput: {
    width: "100%",
    maxWidth: "640px",
    borderRadius: "lg",
    boxShadow: "sm",
  } as SxProps,
  tableSheet: {
    borderRadius: "lg",
    boxShadow: "sm",
    overflowX: "auto",
    mb: 3,
  } as SxProps,
  paginationBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 2,
  } as SxProps,
};
