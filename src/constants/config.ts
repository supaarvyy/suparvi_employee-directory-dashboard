import { EmployeeStatus } from "../types/employee";

/** Base endpoint for the external user mock API */
export const API_BASE_URL = "https://dummyjson.com/users";
export const DEBOUNCE_DELAY_MS = 300;
export const ITEMS_PER_PAGE = 10;
export const MOCK_API_DELAY_MS = 600;

export const STATUS_OPTIONS: EmployeeStatus[] = [
  "Active",
  "Inactive",
  "On Leave",
];

/** Global theme configuration values */
export const THEME_COLORS = {
  NAVBAR_BG: "rgb(180, 100, 20)",
};
