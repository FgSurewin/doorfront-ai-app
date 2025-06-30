import React, { useState,useEffect } from "react";
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
  SingleUser,
  fetchAllAdmins,
} from "../../../apis/user";

interface AccessLevelProps {
  onClose: () => void;
}

const UserSearchModal: React.FC<AccessLevelProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [admins, setAdmins] = useState<SingleUser[]>([]);
  const [searchResults, setSearchResults] = useState<SingleUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        setIsLoading(true);

        const response = await fetchAllAdmins();
        const adminsList = Array.isArray(response.data) ? response.data : [];
        
        if (Array.isArray(adminsList)) {
          setAdmins(adminsList);
        } else {
          console.warn("Admin list is not an array", adminsList);
          setAdmins([]);
        }

      } catch (error) {
        console.error("Failed to fetch admins", error);
        setAdmins([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdmins();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await searchUserByNameOrEmail(searchTerm);
      // response.data assumed to be an array of users now
      setSearchResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Search error", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  // Merge admins and search results: searched users go on top (no duplicates)
  const combinedUsers = React.useMemo(() => {
    // Create a map of user IDs from searchResults to filter out duplicates from admins
    const searchIds = new Set(searchResults.map((u) => u._id));
    // Filter admins to exclude those already in searchResults
    const filteredAdmins = admins.filter((admin) => !searchIds.has(admin._id));
    // Concatenate search results on top + remaining admins below
    return [...searchResults, ...filteredAdmins];
  }, [admins, searchResults]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHasSearched(false);
  };

  const handleGiveAdmin = async (userId: string) => {
    try {
      await grantAdminRight(userId);
      setSnackbarMessage(`Admin rights granted`);
      setSnackbarOpen(true);
      // Update UI by refreshing admins list or updating the local state
      setAdmins((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accessLevel: "admin" } : u))
      );
      setSearchResults((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accessLevel: "admin" } : u))
      );
    } catch {
      setSnackbarMessage("Failed to grant admin rights");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleRevokeAdmin = async (userId: string) => {
    try {
      await revokeAdminRight(userId);
      setSnackbarMessage(`Admin rights revoked`);
      setSnackbarOpen(true);
      setAdmins((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accessLevel: "basic" } : u))
      );
      setSearchResults((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accessLevel: "basic" } : u))
      );
    } catch {
      setSnackbarMessage("Failed to revoke admin rights");
      setSnackbarOpen(true);
    }
  };
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Search User and Manage Admin Rights</DialogTitle>

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
            sx={{ ml: 1 }}
          >
            Search
          </Button>
        </Box>

        {isLoading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && combinedUsers.length === 0 && (
          <Box mt={2}>
            <Typography>No admins found.</Typography>
          </Box>
        )}

        {combinedUsers.map((user) => (
          <Box
            key={user._id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            p={1}
            border={1}
            borderRadius={1}
            borderColor="divider"
          >
            <Box>
              <Typography variant="body1">
                <strong>Name:</strong> {user.nickname || user.username}
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
                  onClick={() => handleRevokeAdmin(user._id)}
                  color="secondary"
                  variant="contained"
                  sx={{ width: 200 }}
                >
                  Revoke Admin Right
                </Button>
              ) : (
                <Button
                  onClick={() => handleGiveAdmin(user._id)}
                  color="primary"
                  variant="contained"
                  sx={{ width: 200 }}
                >
                  Give Admin Right
                </Button>
              )}
            </Box>
          </Box>
        ))}

        {hasSearched &&
          !isLoading &&
          searchResults.length === 0 &&
          searchTerm && (
            <Box mt={2}>
              <Typography>No users found with: "{searchTerm}"</Typography>
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
