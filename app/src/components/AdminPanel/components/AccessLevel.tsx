import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
  Box,
  Snackbar,
  Typography,
} from "@mui/material";
import {
  searchUserByNameOrEmail,
  grantAdminRight,
  revokeAdminRight,
} from "../../../apis/user";

interface User {
  nickname: string;
  email: string;
  role: string;
  accessLevel: string;
  _id: string;
}

interface AccessLevelProps {
  onClose: () => void;
}

const UserSearchModal: React.FC<AccessLevelProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await searchUserByNameOrEmail(searchTerm);
      setUser(response.data);
    } catch (error) {
      console.error("User not found or error occurred", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHasSearched(false);
  };

  const handleGiveAdmin = async () => {
    if (user) {
      try {
        await grantAdminRight(user._id);
        setSnackbarMessage(`Admin rights granted to ${user.nickname}`);
        setSnackbarOpen(true);
        setUser((prevUser) => ({ ...prevUser!, accessLevel: "admin" }));
      } catch (error) {
        setSnackbarMessage("Failed to grant admin rights");
        setSnackbarOpen(true);
      }
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleRevokeAdmin = async () => {
    if (user) {
      try {
        await revokeAdminRight(user._id);
        setSnackbarMessage(`Admin rights revoked from ${user.nickname}`);
        setSnackbarOpen(true);
        setUser({ ...user, accessLevel: "basic" });
      } catch (error) {
        console.error("Failed to revoke admin rights:", error);
        setSnackbarOpen(true);
      }
    }
  };
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Search User and Give Admin Rights</DialogTitle>
      
      <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            label="Search by Name or Email"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            fullWidth
            margin="normal"
          />

          <Button
            onClick={handleSearch}
            color="primary"
            variant="contained"
            disabled={isLoading}
            style={{ marginLeft: 10 }}
          >
            Search
          </Button>
        </Box>

        {isLoading && (
          <Box display="flex" justifyContent="center" marginTop={2}>
            <CircularProgress />
          </Box>
        )}

        {user && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginTop={2}
          >
            <Box>
              <Typography variant="body1">
                <strong>Name:</strong> {user.nickname}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> {user.role}
              </Typography>
              <Typography variant="body1">
                <strong>AccessLevel:</strong> {user.accessLevel}
              </Typography>
            </Box>
            <Box>
              {user.accessLevel === "admin" ? (
                <Button
                  onClick={handleRevokeAdmin}
                  color="secondary"
                  variant="contained"
                  style={{ width: "200px" }}
                >
                  Revoke Admin Right
                </Button>
              ) : (
                <Button
                  onClick={handleGiveAdmin}
                  color="secondary"
                  variant="contained"
                  style={{ width: "200px" }}
                >
                  Give Admin Right
                </Button>
              )}
            </Box>
          </Box>
        )}

        {hasSearched && !user && !isLoading && searchTerm && (
          <Box marginTop={2}>
            <p>No user found with the name or email: "{searchTerm}"</p>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default UserSearchModal;
