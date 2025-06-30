import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Typography,
  CircularProgress,
  Box,
  TextField,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  getAllUsersFromDB,
  searchUserByNameOrEmail,
  grantAdminRight,
  revokeAdminRight,
  addCertifiedHours,
  SingleUser,
} from "../../../apis/user";
import {
  getUserLabeledTime,
  getCurrentTime,
} from "../../../utils/volunteerTimeCalc";
import AddHoursModal from "./addHoursModal";
interface UserListProps {
  onClose: () => void;
}

const UserList: React.FC<UserListProps> = ({ onClose }) => {
  const [users, setUsers] = useState<SingleUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SingleUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SingleUser | null>(null);

  // ✅ Fetch all users on mount

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsersFromDB();
      if (Array.isArray(response.data)) {
        setUsers(response.data.slice().reverse());
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ✅ Search when debounced input changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedTerm.length === 0) {
        setSearchPerformed(false);
        setSearchResults([]);
        return;
      }

      setSearchPerformed(true);
      setLoading(true);
      setError("");

      try {
        const response = await searchUserByNameOrEmail(debouncedTerm); // ✅ FIXED
        if (Array.isArray(response.data) && response.data.length > 0) {
          setSearchResults(response.data as SingleUser[]);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        setError("User not found or error occurred.");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedTerm]);

  // ✅ Handler just sets the input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box
      p={3}
      sx={{ height: "95vh", display: "flex", flexDirection: "column" }}
    >
      {/* Header and Close Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: "white",
          pb: 1,
        }}
      >
        <Typography variant="h5">All Users</Typography>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </Box>

      {/* Search Field */}
      <Box
        mb={2}
        sx={{
          position: "sticky",
          top: 56,
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        <TextField
          label="Search users"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      {/* Loading and Error States */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      {/* Table */}
      {!loading && (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "70vh", overflow: "auto", minWidth: 1000 }}
        >
          <Table stickyHeader sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell sx={{ width: 200, wordWrap: "break-word" }}>
                  <strong>Email</strong>
                </TableCell>
                <TableCell sx={{ width: 100 }}>
                  <strong>Role</strong>
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <strong>Institution</strong>
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}>
                  <strong>Score</strong>
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}>
                  <strong>Labels</strong>
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}>
                  <strong>Reviews</strong>
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}>
                  <strong>Created</strong>
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}>
                  <strong>Hours Total</strong>
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}>
                  <strong>Hours Current</strong>
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}>
                  <strong>Hours Certified</strong>
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}>
                  <strong>Add Certified Hours</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(searchPerformed ? searchResults : users).map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.nickname || user.username}</TableCell>
                  <TableCell sx={{ wordWrap: "break-word" }}>
                    {user.email}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.institution}</TableCell>
                  <TableCell align="center">{user.score}</TableCell>
                  <TableCell align="center">{user.label}</TableCell>
                  <TableCell align="center">{user.review}</TableCell>
                  <TableCell align="center">{user.create}</TableCell>
                  <TableCell align="center">
                    {getUserLabeledTime(user)}
                  </TableCell>
                  <TableCell align="center">{getCurrentTime(user)}</TableCell>
                  <TableCell align="center">
                    {user.hoursCertified ?? 0}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      sx={{
                        minWidth: "50px",
                        padding: "8px 6px",
                        fontWeight: "bold",
                      }}
                      variant="contained"
                      onClick={() => {
                        setSelectedUser(user);
                        setDialogOpen(true);
                      }}
                      color="primary"
                    >
                      +
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Add Certified Hours Modal */}
      <AddHoursModal
        dialogOpen={dialogOpen}
        setDialogOpen={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedUser(null); // Clear selection when modal closes
          }
        }}
        user={selectedUser}
        onUserUpdate={(updatedUser) => {
          setUsers((prev) =>
            prev.map((u) => (u.email === updatedUser.email ? updatedUser : u))
          );
        }}
      />
    </Box>
  );
};

export default UserList;
