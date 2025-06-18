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
  ListItem,
} from "@mui/material";
import {
  getAllUsersFromDB,
  searchUserByNameOrEmail,
  grantAdminRight,
  revokeAdminRight,
} from "../../../apis/user";

interface UserListProps {
  onClose: () => void;
}

interface User {
  email: string;
  username: string;
  score: number;
  role: string;
  labels: number;
  review: number;
  create: number;
  bonus: number;
  institution: string;
  accessLevel?: string;
}

const UserList: React.FC<UserListProps> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // ✅ Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsersFromDB();
        setUsers([...response.data].reverse());
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

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
        const response = await searchUserByNameOrEmail(debouncedTerm);

        if (Array.isArray(response.data) && response.data.length > 0) {
          const convertedUsers: User[] = response.data.map((user: any) => ({
            email: user.email,
            username: user.nickname || "N/A",
            role: user.role,
            score: user.score ?? 0,
            labels: user.label ?? 0,
            review: user.review ?? 0,
            bonus: user.bonus ?? 0,
            create: user.create ?? 0,
            institution: "",
            accessLevel: user.accessLevel || "basic",
          }));

          setSearchResults(convertedUsers);
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
    <Box p={3} sx={{ height: '95vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header and Close Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: 'white', pb: 1 }}
      >
        <Typography variant="h5">All Users</Typography>
        <Button onClick={onClose} color="primary">Close</Button>
      </Box>

      {/* Search Field */}
      <Box mb={2} sx={{ position: 'sticky', top: 56, zIndex: 1, backgroundColor: 'white' }}>
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
          sx={{ maxHeight: '70vh', overflow: "auto", minWidth: 1000 }}
        >
          <Table stickyHeader sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell sx={{ width: 300, wordWrap: "break-word" }}><strong>Email</strong></TableCell>
                <TableCell sx={{ width: 100 }}><strong>Role</strong></TableCell>
                <TableCell sx={{ maxWidth: 200 }}><strong>Institution</strong></TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}><strong>Score</strong></TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}><strong>Labels</strong></TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}><strong>Reviews</strong></TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}><strong>Created</strong></TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}><strong>Bonus</strong></TableCell>
                <TableCell align="center" sx={{ maxWidth: 100 }}><strong>Access</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(searchPerformed ? searchResults : users).map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell sx={{ wordWrap: "break-word" }}>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.institution}</TableCell>
                  <TableCell align="center">{user.score}</TableCell>
                  <TableCell align="center">{user.labels}</TableCell>
                  <TableCell align="center">{user.review}</TableCell>
                  <TableCell align="center">{user.create}</TableCell>
                  <TableCell align="center">{user.bonus}</TableCell>
                  <TableCell align="center">{user.accessLevel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserList;
