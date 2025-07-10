import React, { useState } from "react";
import {
  Pagination,
  Container,
  Dialog,
  Typography,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useImages } from "./utils/useImages";
import DialogConfirmDelete from "./components/DialogConfirmDelete";
import SearchFilters from "./components/SearchFilters";
import { CollectedImageInterface } from "../../types/collectedImage";
import ImageGrid from "./components/ImageGrid";
import AccessLevel from "./components/AccessLevel";
import UserList from "./components/UserList";
import ImageWindow from "./components/ImageWindow";

const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"creator" | "labledBy" | "address">("creator");
  const [addressFilter, setAddressFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(16); // Fixed page size

  const {
    images,
    totalImages,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    openDialog,
    handleOpenImageInfo,
    selectedImage,
    handleCloseImageInfo,
  } = useImages({
    currentPage,
    imagesPerPage,
    searchQuery,
    searchType,
    addressFilter,
  });

  const totalPages = Math.ceil(totalImages / imagesPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const handleAddressFilterChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddressFilter(e.target.value);
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchType(e.target.value as "creator" | "labledBy" | "address");

  const navigate = useNavigate();
  const handleEditClick = (image: CollectedImageInterface) => {
    if (image?.url) {
      navigate("/adminlabel", { state: { imageSrc: image.url } });
    }
  };

  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [openUserListDialog, setOpenUserListDialog] = useState(false);
  const handleAddAdminClick = () => setOpenAdminDialog(true);
  const handleUserListClick = () => setOpenUserListDialog(true);
  const handleCloseDialog = () => {
    setOpenAdminDialog(false);
    setOpenUserListDialog(false);
  };

  return (
    <Container maxWidth={false} sx={{ p: 2, mb: 3 }}>
      <SearchFilters
        searchQuery={searchQuery}
        searchType={searchType}
        addressFilter={addressFilter}
        onSearchTypeChange={handleSearchTypeChange}
        onSearchQueryChange={handleSearchQueryChange}
        onLabelFilterChange={handleSearchQueryChange}
        onAddressFilterChange={handleAddressFilterChange}
      />

      <Typography sx={{ position: "absolute", top: 140, right: 20, p: 1, borderRadius: 2 }}>
        Total Images: {totalImages}
      </Typography>

      <Button
        variant="contained"
        onClick={handleAddAdminClick}
        sx={{ position: "absolute", top: 100, right: 40, backgroundColor: "#2980b9", color: "white" }}
      >
        Add Admin
      </Button>
      <Button
        variant="contained"
        onClick={handleUserListClick}
        sx={{ position: "absolute", top: 100, right: 180, backgroundColor: "#27ae60", color: "white" }}
      >
        Users List
      </Button>

      <ImageGrid
        images={images}
        onEdit={handleEditClick}
        onDelete={(image) => handleDeleteClick(image.image_id)}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
        openDialog={openDialog}
        onImageClick={handleOpenImageInfo}
      />

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2 }}
        />
      )}

      {/* Dialogs */}
      <DialogConfirmDelete
        open={openDialog}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
      />
      <Dialog open={Boolean(selectedImage)} onClose={handleCloseImageInfo}>
        <DialogContent>
          <ImageWindow selectedImage={selectedImage} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageInfo} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAdminDialog} onClose={handleCloseDialog}>
        <AccessLevel onClose={handleCloseDialog} />
      </Dialog>
      <Dialog open={openUserListDialog} onClose={handleCloseDialog} maxWidth="xl">
        <UserList onClose={handleCloseDialog} />
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
