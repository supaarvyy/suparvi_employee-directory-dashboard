import React, { useState } from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  Box,
  Textarea,
  Stack,
  IconButton,
  Alert,
} from "@mui/joy";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import { submitFeedback } from "../../api/userService";
import { feedbackWizardModalStyles } from "./FeedbackWizardModal.styles";

interface FeedbackWizardModalProps {
  open: boolean;
  employeeId: number;
  employeeName: string;
  onClose: () => void;
}

const TOTAL_STEPS = 3;

export const FeedbackWizardModal: React.FC<FeedbackWizardModalProps> = ({
  open,
  employeeId,
  employeeName,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Reset internal wizard state
  const resetForm = () => {
    setStep(1);
    setRating(0);
    setHoverRating(0);
    setComments("");
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    if (submitting) return; // Prevent closing while network request is pending
    resetForm();
    onClose();
  };

  const validateStep = (): boolean => {
    if (step === 1 && rating === 0) {
      setError("Please select a star rating before proceeding.");
      return false;
    }
    if (step === 2 && !comments.trim()) {
      setError("Please provide some written comments before proceeding.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await submitFeedback({ employeeId, rating, comments });
      setSuccess(true);

      // Auto-close after successful submission feedback
      const timer = setTimeout(() => {
        handleClose();
      }, 1500);
      return () => clearTimeout(timer);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to submit feedback. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog sx={feedbackWizardModalStyles.modalDialog}>
        {/* Header */}
        <Box sx={feedbackWizardModalStyles.header}>
          <Typography level="title-lg">
            Leave Feedback for {employeeName}
          </Typography>
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close modal"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Step Indicator */}
        <Box sx={feedbackWizardModalStyles.stepIndicator}>
          <Typography level="body-sm" textColor="neutral.500">
            Step {step} of {TOTAL_STEPS}
          </Typography>
        </Box>

        {error && (
          <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" variant="soft" sx={{ mb: 2 }}>
            Feedback submitted successfully! Closing...
          </Alert>
        )}

        {/* Step 1: Rating */}
        {step === 1 && (
          <Box sx={feedbackWizardModalStyles.stepContainer}>
            <Typography level="title-md" sx={{ mb: 1 }}>
              1. Rate Employee Performance
            </Typography>
            <Typography level="body-sm" sx={{ mb: 2 }}>
              Select a star rating from 1 to 5 stars.
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              sx={{ my: 3 }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  variant="plain"
                  aria-label={`${star} Star${star > 1 ? "s" : ""}`}
                  sx={{
                    color:
                      (hoverRating || rating) >= star
                        ? "warning.solidBg"
                        : "neutral.outlinedBorder",
                    fontSize: "2rem",
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <StarIcon fontSize="inherit" />
                </IconButton>
              ))}
            </Stack>
          </Box>
        )}

        {/* Step 2: Written Comments */}
        {step === 2 && (
          <Box sx={feedbackWizardModalStyles.stepContainer}>
            <Typography level="title-md" sx={{ mb: 1 }}>
              2. Written Comments
            </Typography>
            <Typography level="body-sm" sx={{ mb: 2 }}>
              Provide constructive feedback or remarks on performance.
            </Typography>
            <Textarea
              placeholder="Type your feedback comments here..."
              minRows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              sx={{ width: "100%" }}
            />
          </Box>
        )}

        {/* Step 3: Final Review */}
        {step === 3 && (
          <Box sx={feedbackWizardModalStyles.stepContainer}>
            <Typography level="title-md" sx={{ mb: 1 }}>
              3. Review & Submit
            </Typography>
            <Typography level="body-sm" sx={{ mb: 2 }}>
              Please review your feedback details before submitting.
            </Typography>
            <Box sx={feedbackWizardModalStyles.reviewBox}>
              <Typography level="body-sm">
                <strong>Rating:</strong> {rating} / 5 Stars
              </Typography>
              <Typography level="body-sm" sx={{ mt: 1 }}>
                <strong>Comments:</strong> {comments || "No comments provided."}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Footer Actions */}
        <Box sx={feedbackWizardModalStyles.footer}>
          {step > 1 && (
            <Button
              variant="outlined"
              color="neutral"
              onClick={handleBack}
              disabled={submitting || success}
            >
              Back
            </Button>
          )}
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            {step < TOTAL_STEPS ? (
              <Button variant="solid" color="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="solid"
                color="success"
                onClick={handleSubmit}
                loading={submitting}
                disabled={success}
              >
                Submit Feedback
              </Button>
            )}
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};
