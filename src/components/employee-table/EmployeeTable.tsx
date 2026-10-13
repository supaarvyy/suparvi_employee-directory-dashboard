import React from "react";
import { Table, Sheet, Input, Button, Typography, Box, Alert } from "@mui/joy";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Employee } from "../../types/employee";
import { employeeTableStyles } from "./EmployeeTable.styles";
import { ITEMS_PER_PAGE } from "../../constants/config";

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  errorMessage: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectEmployee: (emp: Employee) => void;
  page: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onRetry: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = React.memo(
  ({
    employees,
    loading,
    errorMessage,
    searchQuery,
    onSearchChange,
    onSelectEmployee,
    page,
    total,
    onPageChange,
    onRetry,
  }) => {
    // Calculate total pages for pagination navigation
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;

    return (
      <Box sx={employeeTableStyles.container}>
        {/* Header Title and Subtitle */}
        <Box sx={{ textAlign: "center", mb: 4, maxWidth: "700px", mx: "auto" }}>
          <Typography
            level="h1"
            sx={{
              fontSize: { xs: "2.25rem", md: "3.25rem" },
              fontWeight: 800,
              mb: 1,
            }}
          >
            Employee Directory
          </Typography>
          <Typography
            level="body-md"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "1rem", md: "1.15rem" },
            }}
          >
            Search, filter, and inspect enterprise personnel records, details,
            and department statuses instantly.
          </Typography>
        </Box>

        {/* Search Filter Input */}
        <Box sx={employeeTableStyles.searchBox}>
          <Input
            size="lg"
            startDecorator={<SearchRoundedIcon />}
            placeholder="Search by employee name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={employeeTableStyles.searchInput}
          />
        </Box>

        {/* Error State Banner with Retry Action */}
        {errorMessage && (
          <Alert
            color="danger"
            sx={{ mb: 3 }}
            endDecorator={
              <Button size="sm" onClick={onRetry}>
                Retry
              </Button>
            }
          >
            {errorMessage}
          </Alert>
        )}

        {/* Main Data Table Sheet */}
        <Sheet variant="outlined" sx={employeeTableStyles.tableSheet}>
          <Table
            hoverRow
            sx={{
              minWidth: 780,
              tableLayout: "fixed",
              "& th": {
                fontWeight: "lg",
                backgroundColor: "background.level1",
                py: "14px",
              },
              "& td": { verticalAlign: "middle", py: "14px" },
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "25%" }}>Name</th>
                <th style={{ width: "32%" }}>Email</th>
                <th style={{ width: "23%" }}>Company</th>
                <th style={{ width: "10%" }}>Status</th>
                <th style={{ width: "10%", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <Typography level="body-md" sx={{ fontWeight: "md" }}>
                        {emp.firstName} {emp.lastName}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        level="body-sm"
                        sx={{ color: "text.secondary" }}
                      >
                        {emp.email}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        {emp.company?.name}
                      </Typography>
                    </td>
                    <td>
                      {/* Dynamic status badge styling */}
                      <Box
                        component="span"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "sm",
                          fontSize: "xs",
                          fontWeight: "md",
                          bgcolor:
                            emp.status === "Active"
                              ? "success.softBg"
                              : emp.status === "Inactive"
                              ? "danger.softBg"
                              : "warning.softBg",
                          color:
                            emp.status === "Active"
                              ? "success.solidBg"
                              : emp.status === "Inactive"
                              ? "danger.solidBg"
                              : "warning.solidBg",
                        }}
                      >
                        {emp.status}
                      </Box>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEmployee(emp);
                        }}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Sheet>

        {/* Pagination Controls */}
        <Box sx={employeeTableStyles.paginationBox}>
          <Button
            size="sm"
            variant="outlined"
            disabled={page === 1 || loading}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Typography level="body-sm">
            Page {page} of {totalPages}
          </Typography>
          <Button
            size="sm"
            variant="outlined"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>
    );
  }
);
