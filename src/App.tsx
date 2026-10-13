import { useState, useEffect, useCallback } from "react";
import { CssVarsProvider, CssBaseline, Box } from "@mui/joy";
import { Navbar } from "./components/navbar/Navbar";
import { EmployeeTable } from "./components/employee-table/EmployeeTable";
import { EmployeeDetailsModal } from "./components/employee-details/EmployeeDetailsModal";
import { fetchEmployees } from "./api/userService";
import { useDebounce } from "./hooks/useDebounce";
import { Employee, EmployeeStatus } from "./types/employee";
import { DEBOUNCE_DELAY_MS, ITEMS_PER_PAGE } from "./constants/config";

export default function App() {
  // Navigation and UI state
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // Directory data & request status states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pagination & Search filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // Modal inspection state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  // Debounce search input to prevent excessive API requests
  const debouncedSearch = useDebounce(searchQuery, DEBOUNCE_DELAY_MS);

  /**
   * Fetches paginated and filtered employee records from the backend service.
   * Wrapped in useCallback to maintain stable reference across renders.
   */
  const loadData = useCallback(async (pageNum: number, search: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await fetchEmployees(pageNum, ITEMS_PER_PAGE, search);
      setEmployees(data.users);
      setTotal(data.total);
    } catch {
      setErrorMessage(
        "Failed to load employee records from server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset to page 1 whenever the debounced search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Synchronize table data whenever pagination or search filters update
  useEffect(() => {
    loadData(page, debouncedSearch);
  }, [page, debouncedSearch, loadData]);

  /**
   * Optimistically updates an employee's status in the local state array.
   */
  const handleStatusUpdated = useCallback(
    (id: number, newStatus: EmployeeStatus) => {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, status: newStatus } : emp))
      );
    },
    []
  );

  return (
    <CssVarsProvider defaultMode="light">
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.body",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

        {/* Main Directory Table Layout */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
          <EmployeeTable
            employees={employees}
            loading={loading}
            errorMessage={errorMessage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectEmployee={(emp) => setSelectedEmployeeId(emp.id)}
            page={page}
            total={total}
            onPageChange={setPage}
            onRetry={() => loadData(page, debouncedSearch)}
          />
        </Box>

        {/* Detailed Inspection & Feedback Wizard Modal */}
        <EmployeeDetailsModal
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      </Box>
    </CssVarsProvider>
  );
}
