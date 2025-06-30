import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import {
  addCertifiedHours as apiAddCertifiedHours,
  SingleUser,
} from "../../../apis/user";
import { getCurrentTimeHours } from "../../../utils/volunteerTimeCalc";

interface AddHoursModalProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  user: SingleUser | null;
  onUserUpdate: (updatedUser: SingleUser) => void;
  
}

const AddHoursModal: React.FC<AddHoursModalProps> = ({
  dialogOpen,
  setDialogOpen,
  user,
  onUserUpdate,
}) => {
  const [hours, setHours] = useState<number>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"add" | "remove">("add");

  useEffect(() => {
    if (dialogOpen) {
      setHours(1);
      setError("");
      setMode("add");
    }
  }, [dialogOpen, user]);

  const handleClose = () => {
    setError("");
    setHours(1);
    setMode("add");
    setDialogOpen(false);
  };

  if (!user) return null;

  const availableHours = getCurrentTimeHours(user);
  const certifiedHours = user.hoursCertified ?? 0;

  const validate = (): boolean => {
    if (hours <= 0) {
      setError("Please enter a positive number of hours.");
      return false;
    }
    if (mode === "add" && hours > availableHours) {
      setError(
        `Cannot issue more than available time (${availableHours.toFixed(2)}h).`
      );
      return false;
    }
    if (mode === "remove" && hours > certifiedHours) {
      setError(
        `Cannot remove more than certified hours (${certifiedHours.toFixed(
          2
        )}h).`
      );
      return false;
    }
    return true;
  };

  const handleIssue = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const issueHours = mode === "remove" ? -hours : hours;
      await apiAddCertifiedHours(user.email, issueHours);
      console.log("Adding certified hours for:", user.email, hours);
      const updatedUser: SingleUser = {
        ...user,
        hoursCertified: (user.hoursCertified ?? 0) + issueHours,
      };

      onUserUpdate(updatedUser);
      handleClose();
    } catch (e) {
      console.error(e);
      setError("Failed to update certified hours. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Issuing hours for: <strong>{user.nickname || user.username}</strong>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} mb={2}>
          <Button
            variant={mode === "add" ? "contained" : "outlined"}
            color="primary"
            fullWidth
            onClick={() => {
              setMode("add");
              setHours(1);
              setError("");
            }}
          >
            Add
          </Button>
          <Button
            variant={mode === "remove" ? "contained" : "outlined"}
            color="error"
            fullWidth
            onClick={() => {
              setMode("remove");
              setHours(1);
              setError("");
            }}
            disabled={certifiedHours === 0}
            title={
              certifiedHours === 0 ? "No certified hours to remove" : undefined
            }
          >
            Remove
          </Button>
        </Box>

        <TextField
          label="Hours"
          type="number"
          fullWidth
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          inputProps={{ min: 1, step: 1 }}
          disabled={loading}
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleIssue}
          variant="contained"
          color={mode === "add" ? "primary" : "error"}
          disabled={loading}
        >
          {loading ? "Processing..." : "Issue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHoursModal;
