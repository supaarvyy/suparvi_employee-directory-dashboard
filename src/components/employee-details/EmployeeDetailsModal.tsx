import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Select,
  Option,
} from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import { fetchEmployeeById, updateEmployeeStatus } from "../../api/userService";
import { Employee, EmployeeStatus } from "../../types/employee";
import { FeedbackWizardModal } from "../feedback-wizard/FeedbackWizardModal";
import { employeeDetailsModalStyles } from "./EmployeeDetailsModal.styles";

interface EmployeeDetailsModalProps {
  employeeId: number | null;
  onClose: () => void;
  onStatusUpdated: (id: number, status: EmployeeStatus) => void;
}

export const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  employeeId,
  onClose,
  onStatusUpdated,
}) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!employeeId) {
      setEmployee(null);
      setFeedbackOpen(false); // Reset feedback wizard when modal closes/switches
      return;
    }
    setLoading(true);
    fetchEmployeeById(employeeId)
      .then((data) => {
        setEmployee(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [employeeId]);

  if (!employeeId) return null;

  const handleStatusChange = async (newStatus: EmployeeStatus | null) => {
    if (!newStatus || !employee) return;
    setEmployee({ ...employee, status: newStatus });
    await updateEmployeeStatus(employee.id, newStatus);
    onStatusUpdated(employee.id, newStatus);
  };

  const fullName = employee ? `${employee.firstName} ${employee.lastName}` : "";

  return (
    <>
      <Modal open={Boolean(employeeId)} onClose={onClose}>
        <ModalDialog sx={employeeDetailsModalStyles.modalDialog}>
          {loading || !employee ? (
            <Box sx={employeeDetailsModalStyles.loadingBox}>
              <CircularProgress size="md" />
            </Box>
          ) : (
            <>
              {/* Header */}
              <Box sx={employeeDetailsModalStyles.headerBox}>
                <Typography
                  level="h4"
                  sx={employeeDetailsModalStyles.headerTitle}
                >
                  {fullName}
                </Typography>
                <IconButton size="sm" variant="plain" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Status Update Control */}
              <Box sx={employeeDetailsModalStyles.statusBox}>
                <Typography level="body-sm" sx={{ fontWeight: "md" }}>
                  Status:
                </Typography>
                <Select
                  size="sm"
                  value={employee.status}
                  onChange={(_, val) =>
                    handleStatusChange(val as EmployeeStatus)
                  }
                  sx={employeeDetailsModalStyles.statusSelect}
                >
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                  <Option value="On Leave">On Leave</Option>
                </Select>
              </Box>

              {/* Tabbed Content */}
              <Tabs
                defaultValue={0}
                sx={employeeDetailsModalStyles.tabsContainer}
              >
                <TabList>
                  <Tab>Profile</Tab>
                  <Tab>Address</Tab>
                  <Tab>Company</Tab>
                </TabList>
                <TabPanel value={0} sx={employeeDetailsModalStyles.tabContent}>
                  <Typography level="body-sm" mb={1}>
                    <strong>Email:</strong> {employee.email}
                  </Typography>
                  <Typography level="body-sm" mb={1}>
                    <strong>Phone:</strong> {employee.phone}
                  </Typography>
                  <Typography level="body-sm">
                    <strong>Username:</strong> {employee.username}
                  </Typography>
                </TabPanel>
                <TabPanel value={1} sx={employeeDetailsModalStyles.tabContent}>
                  <Typography level="body-sm" mb={1}>
                    <strong>Street:</strong> {employee.address.address}
                  </Typography>
                  <Typography level="body-sm" mb={1}>
                    <strong>City/State:</strong> {employee.address.city},{" "}
                    {employee.address.state}
                  </Typography>
                  <Typography level="body-sm">
                    <strong>Postal Code:</strong> {employee.address.postalCode}
                  </Typography>
                </TabPanel>
                <TabPanel value={2} sx={employeeDetailsModalStyles.tabContent}>
                  <Typography level="body-sm" mb={1}>
                    <strong>Company:</strong> {employee.company.name}
                  </Typography>
                  <Typography level="body-sm" mb={1}>
                    <strong>Title:</strong> {employee.company.title}
                  </Typography>
                  <Typography level="body-sm">
                    <strong>Department:</strong> {employee.company.department}
                  </Typography>
                </TabPanel>
              </Tabs>

              {/* Footer with Leave Feedback trigger */}
              <Box sx={employeeDetailsModalStyles.footerBox}>
                <Button
                  variant="soft"
                  color="primary"
                  onClick={() => setFeedbackOpen(true)}
                >
                  Leave Feedback
                </Button>
                <Button variant="plain" color="neutral" onClick={onClose}>
                  Close
                </Button>
              </Box>
            </>
          )}
        </ModalDialog>
      </Modal>

      {/* Nested Feedback Wizard Modal */}
      {employee && (
        <FeedbackWizardModal
          open={feedbackOpen}
          employeeId={employee.id}
          employeeName={fullName}
          onClose={() => setFeedbackOpen(false)}
        />
      )}
    </>
  );
};
